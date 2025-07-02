import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/BookingProcessPage.css';

const BookingProcessPage = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();

  const user_id = localStorage.getItem('userId'); // ⬅ make sure this key matches your login
  const email = localStorage.getItem('email');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!email || !user_id) {
      navigate('/auth/login');
    }
  }, [navigate, email, user_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user_id) {
      setError('User not logged in');
      return;
    }

    setLoading(true);
    setError(null);

    const bookingData = {
      table_id: Number(tableId),
      user_id: Number(user_id),
      name: formData.name,
      phone: formData.phone,
      date: formData.date,
      time: formData.time,
    };

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle redirect after success
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        navigate('/booking');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted, navigate]);

  if (submitted) {
    return (
      <div className="bookingprocessconfirmation-message">
        <p>✅ Booking successful for Table {tableId}!</p>
        <p>You will be redirected shortly...</p>
      </div>
    );
  }

  return (
    <div className="booking-process">
      <div className="booking-container">
        <div className="bookingprocessleft-panel">
          <h2>Booking Table {tableId}</h2>

          {error && <p className="error-message">Error: {error}</p>}

          <form onSubmit={handleSubmit} className="bookingprocessbooking-form">
            <div className="bookingprocessform-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="bookingprocessform-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                title="Enter a valid 10-digit phone number"
                className="form-input"
              />
            </div>

            <div className="bookingprocessform-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="bookingprocessform-group">
              <label htmlFor="time">Time</label>
              <input
                id="time"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <button
              type="submit"
              className="bookingprocesssubmit-btn"
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingProcessPage;
