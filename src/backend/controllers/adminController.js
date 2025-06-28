// controllers/adminController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database/db.js'; // your pg.Pool

    // Simple login check without hashing
    export const adminLogin = async (req, res) => {
    const { emailOrUsername, password } = req.body;

    try {
        const result = await pool.query(
        'SELECT * FROM resto_admins WHERE email = $1 OR username = $1',
        [emailOrUsername]
        );

        const admin = result.rows[0];
        if (!admin) {
        return res.status(401).json({ message: 'Invalid email or username' });
        }

        // Direct string comparison
        if (password !== admin.password) {
        return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
        { id: admin.id, username: admin.username, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
        );

        res.status(200).json({ message: 'Admin login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Login error', error: err.message });
    }
    };
