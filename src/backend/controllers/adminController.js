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

        // Direct password comparison (not hashed for now)
        if (password !== admin.password) {
        return res.status(401).json({ message: 'Invalid password' });
        }

        // Create JWT token
        const token = jwt.sign(
        { id: admin.id, username: admin.username, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
        );

        // ✅ Send token + email in response so frontend can store it
        res.status(200).json({
        message: 'Admin login successful',
        token,
        email: admin.email, // this will be stored by frontend
        });
    } catch (err) {
        res.status(500).json({ message: 'Login error', error: err.message });
    }
    };


    // Get admin by email
        export const getAdminByEmail = async (req, res) => {
        const { email } = req.params;

        try {
            const result = await pool.query(
            'SELECT id, username, email FROM resto_admins WHERE email = $1',
            [email]
            );

            if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
            }

            res.status(200).json(result.rows[0]);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching admin', error: err.message });
        }
        };

    // Get all admins
    export const getAllAdmins = async (req, res) => {
    try {
        const result = await pool.query(
        'SELECT id, username, email FROM resto_admins ORDER BY id ASC'
        );

        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching admins', error: err.message });
    }
    };
    // Dashboard stats
    export const getAdminDashboardStats = async (req, res) => {
    try {
        console.log("📊 /api/admin/stats endpoint hit");

        const [productsRes, tablesRes, bookingsRes, usersRes] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM resto_products'),
        pool.query('SELECT COUNT(*) FROM restaurant_tables'),
        pool.query('SELECT COUNT(*) FROM bookings WHERE date = CURRENT_DATE'),
        pool.query('SELECT COUNT(*) FROM resto_users'),
        ]);

        // Defensive fallback if any query returns no rows (unlikely but safe)
        const productsCount = productsRes.rows[0]?.count ?? 0;
        const tablesCount = tablesRes.rows[0]?.count ?? 0;
        const bookingsCount = bookingsRes.rows[0]?.count ?? 0;
        const usersCount = usersRes.rows[0]?.count ?? 0;

        res.status(200).json({
        products: parseInt(productsCount, 10),
        tables: parseInt(tablesCount, 10),
        bookingsToday: parseInt(bookingsCount, 10),
        users: parseInt(usersCount, 10),
        });
    } catch (err) {
        console.error("❌ Error in dashboard stats:", err);
        res.status(500).json({ message: 'Failed to fetch admin dashboard stats', error: err.message });
    }
    };