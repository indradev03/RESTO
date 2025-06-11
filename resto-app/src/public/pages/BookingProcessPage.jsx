import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/BookingProcessPage.css'; // Optional for styling

const BookingProcessPage = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: ''
  });

  const [submitted, setSubmitted] = useState(false);

  // 🔒 Check if user is logged in
  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) {
      navigate('/login'); // Redirect to login if not logged in
    } else {
      localStorage.setItem('hasNewBooking', 'true'); // Notify header
      window.dispatchEvent(new Event('bookingStatusChanged'));
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBooking = { tableId, ...formData };

    const existing = JSON.parse(localStorage.getItem('latestBooking')) || [];
    const updatedBookings = Array.isArray(existing)
      ? [...existing, newBooking]
      : [existing, newBooking];

    localStorage.setItem('latestBooking', JSON.stringify(updatedBookings));
    setSubmitted(true);

    setTimeout(() => {
      navigate('/booking');
    }, 3000);
  };

  return (
    <div className="booking-process">
      <h2>Booking Table {tableId}</h2>

      {submitted ? (
        <div className="confirmation-message">
          <p>✅ Booking successful for Table {tableId}!</p>
          <p>You will be redirected shortly...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="booking-form">
          <label>
            Full Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Phone Number:
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              title="Enter 10-digit phone number"
            />
          </label>

          <label>
            Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Time:
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">Confirm Booking</button>
        </form>
      )}
    </div>
  );
};

export default BookingProcessPage;
