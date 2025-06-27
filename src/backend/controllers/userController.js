    import bcrypt from 'bcryptjs';
    import pool from '../db.js';

    /**
     * Get all users (safe fields)
     */
    export const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role, contact, address FROM resto_users');
        res.status(200).json({ users: result.rows });
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ error: 'Server error', detail: err.message });
    }
    };

    /**
     * Get user by ID
     */
    export const getById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
        'SELECT id, name, email, role, contact, address FROM resto_users WHERE id = $1',
        [id]
        );

        if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user: result.rows[0] });
    } catch (err) {
        console.error('Get user by ID error:', err);
        res.status(500).json({ error: 'Server error', detail: err.message });
    }
    };

    /**
     * Update user by ID
     */
    export const update = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, contact, address, role } = req.body;

    try {
        const existingResult = await pool.query('SELECT * FROM resto_users WHERE id = $1', [id]);
        if (existingResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
        }
        const existingUser = existingResult.rows[0];

        const updatedName = name || existingUser.name;
        const updatedEmail = email || existingUser.email;
        const updatedContact = contact || existingUser.contact;
        const updatedAddress = address || existingUser.address;
        const updatedRole = role || existingUser.role;

        let updatedPassword = existingUser.password;
        if (password) {
        updatedPassword = await bcrypt.hash(password, 10);
        }

        const updateQuery = `
        UPDATE resto_users
        SET name = $1, email = $2, password = $3, contact = $4, address = $5, role = $6
        WHERE id = $7
        RETURNING id, name, email, role, contact, address
        `;

        const updatedResult = await pool.query(updateQuery, [
        updatedName,
        updatedEmail,
        updatedPassword,
        updatedContact,
        updatedAddress,
        updatedRole,
        id,
        ]);

        res.status(200).json({
        message: 'User updated successfully',
        user: updatedResult.rows[0],
        });
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ error: 'Server error', detail: err.message });
    }
    };

    /**
     * Delete user by ID
     */
    export const deleteById = async (req, res) => {
    const { id } = req.params;

    try {
        const existing = await pool.query('SELECT id FROM resto_users WHERE id = $1', [id]);
        if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
        }

        await pool.query('DELETE FROM resto_users WHERE id = $1', [id]);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ error: 'Server error', detail: err.message });
    }
    };
