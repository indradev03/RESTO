import React, { useEffect, useState } from 'react';
import '../../../css/SeeBooking.css';

const SeeBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // Track which booking is deleting

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data.bookings || data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (booking_id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    setDeletingId(booking_id);
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${booking_id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete booking');
      }
      // Remove deleted booking from state to update UI
      setBookings((prev) => prev.filter((b) => b.booking_id !== booking_id));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="loading">Loading bookings...</div>;
  if (error) return <div className="error">{error}</div>;
  if (bookings.length === 0) return <div className="no-bookings">No bookings found.</div>;

  return (
    <div className="see-booking-container">
      <h2>Bookings</h2>
      <table className="booking-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Table</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(({ booking_id, table_id, name, phone, date, time }) => (
            <tr key={booking_id}>
              <td>{booking_id}</td>
              <td>{table_id}</td>
              <td>{name}</td>
              <td>{phone}</td>
              <td>{new Date(date).toLocaleDateString()}</td>
              <td>{time}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(booking_id)}
                  disabled={deletingId === booking_id}
                >
                  {deletingId === booking_id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SeeBooking;
