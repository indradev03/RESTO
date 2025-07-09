    // controllers/adminController.js
    import bcrypt from 'bcryptjs';
    import jwt from 'jsonwebtoken';
    import pool from '../database/db.js'; // your pg.Pool

    /**
     * Admin login (simple, plain password check for now)
     */
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

        // Direct password comparison (plain text, ideally replace with hashed passwords)
        if (password !== admin.password) {
        return res.status(401).json({ message: 'Invalid password' });
        }

        // Create JWT token
        const token = jwt.sign(
        { id: admin.id, username: admin.username, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
        );

        // Send token and email in response
        res.status(200).json({
        message: 'Admin login successful',
        token,
        email: admin.email,
        });
    } catch (err) {
        console.error('❌ Login error:', err);
        res.status(500).json({ message: 'Login error', error: err.message });
    }
    };

    /**
     * Get admin details by email
     */
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
        console.error('❌ Error fetching admin by email:', err);
        res.status(500).json({ message: 'Error fetching admin', error: err.message });
    }
    };

    /**
     * Get all admins (id, username, email)
     */
    export const getAllAdmins = async (req, res) => {
    try {
        const result = await pool.query(
        'SELECT id, username, email FROM resto_admins ORDER BY id ASC'
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('❌ Error fetching all admins:', err);
        res.status(500).json({ message: 'Error fetching admins', error: err.message });
    }
    };
    /**
     * Get dashboard stats for admin panel
     */
    export const getAdminDashboardStats = async (req, res) => {
    try {
        console.log('📊 /api/admin/stats endpoint hit');

        // Run all counts in parallel
        const [productsRes, tablesRes, bookingsRes, usersRes] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM resto_products'),
        pool.query('SELECT COUNT(*) FROM restaurant_tables'),
        pool.query('SELECT COUNT(*) FROM bookings WHERE DATE(date) = CURRENT_DATE'), // <-- updated here
        pool.query('SELECT COUNT(*) FROM resto_users'),
        ]);

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
        console.error('❌ Error in dashboard stats:', err);
        res.status(500).json({ message: 'Failed to fetch admin dashboard stats', error: err.message });
    }
    };


// controllers/adminController.js
    export const getRecentActivities = async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT id, type, message, created_at AS timestamp
        FROM recent_activities
        ORDER BY created_at DESC
        LIMIT 20
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('❌ Error fetching recent activities:', err.stack);
        res.status(500).json({
        message: 'Failed to fetch recent activities',
        error: err.message,
        });
    }
    };


// controllers/adminController.js

export const deleteRecentActivity = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the activity with the given id
    const result = await pool.query(
      'DELETE FROM recent_activities WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Recent activity not found' });
    }

    res.status(200).json({ message: 'Recent activity deleted', deletedActivity: result.rows[0] });
  } catch (err) {
    console.error('❌ Error deleting recent activity:', err);
    res.status(500).json({ message: 'Failed to delete recent activity', error: err.message });
  }
};
