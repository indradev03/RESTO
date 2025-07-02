// controllers/bookingController.js
import pool from '../database/db.js';

/**
 * Create a new booking
 */
export const createBooking = async (req, res) => {
  const { table_id, user_id, name, phone, date, time } = req.body;

  if (!table_id || !user_id || !name || !phone || !date || !time) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO bookings (table_id, user_id, name, phone, date, time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [table_id, user_id, name, phone, date, time];
    const result = await pool.query(query, values);

    res.status(201).json({ booking: result.rows[0] });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get all bookings
 */
export const getAllBookings = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings ORDER BY booking_id DESC;');
    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get booking by booking ID
 */
export const getBookingById = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE booking_id = $1;',
      [bookingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ booking: result.rows[0] });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get all bookings by user ID
 */
export const getBookingsByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE user_id = $1 ORDER BY date DESC, time ASC;',
      [userId]
    );

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete booking by booking ID
 */
export const deleteBookingById = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const result = await pool.query(
      'DELETE FROM bookings WHERE booking_id = $1 RETURNING *;',
      [bookingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found or already deleted' });
    }

    res.json({ message: 'Booking deleted successfully', booking: result.rows[0] });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
