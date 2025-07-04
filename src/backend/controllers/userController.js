    import bcrypt from 'bcryptjs';
    import pool from '../database/db.js';

    /**
     * Get all users (safe fields)
     */
    export const getUsers = async (req, res) => {
    console.log('getUsers controller hit');
    try {
        const result = await pool.query(
        'SELECT user_id, name, email, role, contact, address, profile_image_url FROM resto_users'
        );
        console.log('Users fetched:', result.rows.length);
        res.status(200).json({ users: result.rows });
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ error: 'Server error', detail: err.message });
    }
    };


    /**
     * Get user by user_id
     */
    export const getById = async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(
        'SELECT user_id, name, email, role, contact, address, profile_image_url FROM resto_users WHERE user_id = $1',
        [user_id]
        );

        if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user: result.rows[0] });
    } catch (err) {
        console.error('Get user by user_id error:', err);
        res.status(500).json({ error: 'Server error', detail: err.message });
    }
    };

    /**
     * Update user by user_id
     */
    export const update = async (req, res) => {
    const { user_id } = req.params;
    const { name, email, password, contact, address, role } = req.body;

    try {
        const existingResult = await pool.query('SELECT * FROM resto_users WHERE user_id = $1', [user_id]);
        if (existingResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
        }
        const existingUser = existingResult.rows[0];

        // Use provided values or fallback to existing ones
        const updatedName = name ?? existingUser.name;
        const updatedEmail = email ?? existingUser.email;
        const updatedContact = contact ?? existingUser.contact;
        const updatedAddress = address ?? existingUser.address;
        const updatedRole = role ?? existingUser.role;

        let updatedPassword = existingUser.password;
        if (password && password.trim() !== '') {
        updatedPassword = await bcrypt.hash(password, 10);
        }

        const updateQuery = `
        UPDATE resto_users
        SET name = $1, email = $2, password = $3, contact = $4, address = $5, role = $6
        WHERE user_id = $7
        RETURNING user_id, name, email, role, contact, address, profile_image_url
        `;

        const updatedResult = await pool.query(updateQuery, [
        updatedName,
        updatedEmail,
        updatedPassword,
        updatedContact,
        updatedAddress,
        updatedRole,
        user_id,
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
     * Delete user by user_id
     */
    export const deleteById = async (req, res) => {
    const { user_id } = req.params;

    try {
        const existing = await pool.query('SELECT user_id FROM resto_users WHERE user_id = $1', [user_id]);
        if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
        }

        await pool.query('DELETE FROM resto_users WHERE user_id = $1', [user_id]);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ error: 'Server error', detail: err.message });
    }
    };

    /**
     * Update user profile image by user_id
     */
    export const updateUserImage = async (req, res) => {
    const { user_id } = req.params;

    if (!req.file) {
        console.log('No file received');
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const profileImageUrl = `/uploads/${req.file.filename}`;
    console.log('Saving image URL to DB:', profileImageUrl, 'for user user_id:', user_id);

    try {
        const result = await pool.query(
        'UPDATE resto_users SET profile_image_url = $1 WHERE user_id = $2 RETURNING user_id, profile_image_url',
        [profileImageUrl, user_id]
        );

        if (result.rowCount === 0) {
        console.log('User not found in DB for user_id:', user_id);
        return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
        message: 'Profile image updated successfully',
        imageUrl: profileImageUrl,
        });
    } catch (error) {
        console.error('Error updating profile image:', error);
        res.status(500).json({ error: 'Server error', detail: error.message });
    }
    };
