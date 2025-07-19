import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../css/SeeBooking.css';

const SeeBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

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
    } catch (err) {
      toast.error(err.message || 'Error loading bookings');
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
      setBookings((prev) => prev.filter((b) => b.booking_id !== booking_id));
      toast.success('Booking deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="seebooking-loading">Loading bookings...</div>;
  if (bookings.length === 0) return <div className="seebooking-no-bookings">No bookings found.</div>;

  return (
    <div className="seebooking-container">
      <h2 className="seebooking-title">Bookings</h2>
      <table className="seebooking-table">
        <thead>
          <tr>
            <th className="seebooking-th">Booking ID</th>
            <th className="seebooking-th">Table</th>
            <th className="seebooking-th">Name</th>
            <th className="seebooking-th">Phone</th>
            <th className="seebooking-th">Date</th>
            <th className="seebooking-th">Time</th>
            <th className="seebooking-th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(({ booking_id, table_id, name, phone, date, time }) => (
            <tr key={booking_id} className="seebooking-tr">
              <td className="seebooking-td">{booking_id}</td>
              <td className="seebooking-td">{table_id}</td>
              <td className="seebooking-td">{name}</td>
              <td className="seebooking-td">{phone}</td>
              <td className="seebooking-td">{new Date(date).toLocaleDateString()}</td>
              <td className="seebooking-td">{time}</td>
              <td className="seebooking-td">
                <button
                  className="seebooking-delete-btn"
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

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SeeBooking;
