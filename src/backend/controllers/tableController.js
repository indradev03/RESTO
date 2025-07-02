import pool from '../database/db.js';

// Add Table
export const addTable = async (req, res) => {
  try {
    const { name, seats, location, description, status } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO restaurant_tables (name, seats, location, description, image_url, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, parseInt(seats), location, description, image_url, status || 'For Booking']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Tables
export const getTables = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurant_tables ORDER BY table_id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Table by table_id
export const getTableById = async (req, res) => {
  try {
    const { table_id } = req.params;
    const result = await pool.query('SELECT * FROM restaurant_tables WHERE table_id = $1', [table_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Table
export const updateTable = async (req, res) => {
  try {
    const { table_id } = req.params;
    const { name, seats, location, description, status } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const existing = await pool.query('SELECT * FROM restaurant_tables WHERE table_id = $1', [table_id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }

    const updatedImage = image_url || existing.rows[0].image_url;

    const result = await pool.query(
      `UPDATE restaurant_tables
       SET name = $1, seats = $2, location = $3, description = $4, image_url = $5, status = $6
       WHERE table_id = $7 RETURNING *`,
      [name, parseInt(seats), location, description, updatedImage, status || existing.rows[0].status, table_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Table
export const deleteTable = async (req, res) => {
  try {
    const { table_id } = req.params;
    const result = await pool.query('DELETE FROM restaurant_tables WHERE table_id = $1', [table_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }

    res.json({ message: 'Table deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
