import pool from '../database/db.js';

export const addProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        const result = await pool.query(
        `INSERT INTO resto_products (name, description, price, image_url)
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, description, parseFloat(price), image_url]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM resto_products ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        const existing = await pool.query('SELECT * FROM resto_products WHERE id = $1', [id]);
        if (existing.rows.length === 0) return res.status(404).json({ error: 'Product not found' });

        const updatedImage = image_url || existing.rows[0].image_url;

        const result = await pool.query(
            `UPDATE resto_products SET name=$1, description=$2, price=$3, image_url=$4
            WHERE id=$5 RETURNING *`,
            [name, description, parseFloat(price), updatedImage, id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM resto_products WHERE id = $1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
