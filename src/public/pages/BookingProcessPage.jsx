import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/BookingProcessPage.css';

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

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) {
      navigate('/auth/login');
    } else {
      localStorage.setItem('hasNewBooking', 'true');
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
      <div className="booking-container">
        <div className="bookingprocessleft-panel">
          <h2>Booking Table {tableId}</h2>

          {submitted ? (
            <div className="bookingprocessconfirmation-message">
              <p>✅ Booking successful for Table {tableId}!</p>
              <p>You will be redirected shortly...</p>
            </div>
          ) : (
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
                  title="Enter 10-digit phone number"
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

              <button type="submit" className="bookingprocesssubmit-btn">
                Confirm Booking
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingProcessPage;
