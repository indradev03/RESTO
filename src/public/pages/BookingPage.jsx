import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/BookingPage.css';

const BookingPage = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const userId = localStorage.getItem('userId');

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!email || !userId) {
      navigate('/auth/login');
      return;
    }

    let isMounted = true;

    const fetchBookings = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/bookings/user/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        if (isMounted) {
          setBookings(data.bookings ?? data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          toast.error(`Error: ${err.message}`);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, [email, userId, navigate]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      setCancellingId(bookingId);
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to cancel booking');

      setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));
      toast.success('Booking cancelled successfully');
    } catch (err) {
      toast.error(`Cancel failed: ${err.message}`);
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(+hours);
      date.setMinutes(+minutes);
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeStr;
    }
  };

  if (loading) return <div className="booking-page">Loading your bookings...</div>;
  if (error) return <div className="booking-page error">Error: {error}</div>;

  if (!bookings.length) {
    return (
      <div className="booking-page">
        <h2 className="booking-title">No Bookings Found</h2>
        <p>You have not made any bookings yet.</p>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  return (
    <div className="booking-page">
      <h2 className="booking-title">Your Bookings</h2>
      <div className="booking-grid">
        {bookings.map((booking) => (
          <div key={booking.booking_id} className="booking-card">
            <div className="booking-card-header">
              <h3>Booking #{booking.booking_id}</h3>
            </div>
            <div className="booking-info">
              <p><span>Table:</span> {booking.table_id}</p>
              <p><span>Name:</span> {booking.name}</p>
              <p><span>Phone:</span> {booking.phone}</p>
              <p><span>Date:</span> {formatDate(booking.date)}</p>
              <p><span>Time:</span> {formatTime(booking.time)}</p>
            </div>
            <div className="booking-actions">
              <button
                onClick={() => handleCancel(booking.booking_id)}
                className="cancel-button"
                disabled={cancellingId === booking.booking_id}
              >
                {cancellingId === booking.booking_id ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default BookingPage;
