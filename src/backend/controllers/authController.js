    import bcrypt from 'bcryptjs';
    import jwt from 'jsonwebtoken';
    import pool from '../db.js';

    /**
     * Signup a new user
     */
    export const signup = async (req, res) => {
    const { name, email, password, contact, address, role = 'user' } = req.body;

    try {
        if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const existingUser = await pool.query('SELECT 1 FROM resto_users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
        `INSERT INTO resto_users (name, email, password, role, contact, address)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, email, role, contact, address`,
        [name, email, hashedPassword, role, contact || null, address || null]
        );

        const newUser = result.rows[0];

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

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

    /**
     * Login user
     */
    export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
        }

        const result = await pool.query('SELECT * FROM resto_users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            id: user.id,
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
