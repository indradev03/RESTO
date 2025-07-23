import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import pool from '../database/db.js';

const CLIENT_URL = process.env.CLIENT_URL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Password regex: min 6 chars, at least 1 letter, 1 number, and 1 special character
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

export const signup = async (req, res) => {
  const { name, email, password, contact, address, role = 'user' } = req.body;

  try {
    if (!name.trim()) return res.status(400).json({ error: 'Name is required' });
    if (!email.trim()) return res.status(400).json({ error: 'Email is required' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' });

    const domain = email.split('@')[1].toLowerCase();
    if (domain !== 'gmail.com') {
      return res.status(400).json({ error: 'Only gmail.com email addresses are supported' });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters and include at least one letter, one number, and one special character',
      });
    }

    if (contact && !/^\d{10}$/.test(contact)) {
      return res.status(400).json({ error: 'Contact number must be exactly 10 digits' });
    }

    const existingUser = await pool.query('SELECT 1 FROM resto_users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO resto_users (name, email, password, role, contact, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING user_id, name, email, role, contact, address`,
      [name, email, hashedPassword, role, contact || null, address || null]
    );

    const newUser = result.rows[0];

    await pool.query(
      'INSERT INTO recent_activities (type, message) VALUES ($1, $2)',
      ['user', `New user registered: ${name}`]
    );

    const token = jwt.sign({ user_id: newUser.user_id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      token,
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email.trim()) return res.status(400).json({ error: 'Email is required' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' });

    const domain = email.split('@')[1].toLowerCase();
    if (domain !== 'gmail.com') {
      return res.status(400).json({ error: 'Only gmail.com email addresses are supported' });
    }

    if (!password) return res.status(400).json({ error: 'Password is required' });

    const result = await pool.query('SELECT * FROM resto_users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: 'Email is not registered' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Incorrect password' });

    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact: user.contact,
        address: user.address,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const userResult = await pool.query(
      'SELECT user_id, name FROM resto_users WHERE email = $1',
      [email]
    );

    const genericResponse = {
      message: 'If that email is registered, a reset link was sent.',
    };

    if (userResult.rows.length === 0) {
      return res.json(genericResponse);
    }

    const user = userResult.rows[0];
    const token = jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const encodedToken = encodeURIComponent(token);
    const resetUrl = `${CLIENT_URL}/auth/reset-password/${encodedToken}`;

    const mailOptions = {
      from: `"Resto Support" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${resetUrl}" style="display:inline-block;padding:10px 15px;background:#007BFF;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
        <p>If the button doesn't work, copy and paste the following link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <br/>
        <p>This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Reset link sent to ${email}: ${resetUrl}`);

    return res.json(genericResponse);
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'Password must be at least 6 characters and include at least one letter, one number, and one special character',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.user_id;
    const hashedPassword = await bcrypt.hash(password, 10);

    const updateResult = await pool.query(
      'UPDATE resto_users SET password = $1 WHERE user_id = $2',
      [hashedPassword, user_id]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found or password not updated' });
    }

    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('Reset password error:', err);

    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Reset token has expired.' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: 'Invalid reset token.' });
    }

    res.status(500).json({ error: 'Server error' });
  }
};
