// src/pages/BookingPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/BookingPage.css';

const BookingPage = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem('email');

  const [bookings, setBookings] = useState([]);

  // Load bookings on mount
  useEffect(() => {
    if (!email) {
      navigate('/auth/login'); // Redirect if not logged in
      return;
    }

    const stored = JSON.parse(localStorage.getItem('latestBooking')) || [];

    // Support both single object (old data) and array format
    const formatted = Array.isArray(stored) ? stored : [stored];
    setBookings(formatted);
  }, [email, navigate]);

  const handleCancel = (index) => {
    const updated = [...bookings];
    updated.splice(index, 1); // Remove the selected booking

    setBookings(updated);

    // Update localStorage
    localStorage.setItem('latestBooking', JSON.stringify(updated));
  };

  if (!bookings.length) {
    return (
      <div className="booking-page">
        <h2>No Bookings Found</h2>
        <p>You have not made any bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <h2>Your Booking Details</h2>
      {bookings.map((booking, index) => (
        <div key={index} className="booking-card">
          <ul>
            <li><strong>Table:</strong> {booking.tableId}</li>
            <li><strong>Name:</strong> {booking.name}</li>
            <li><strong>Phone:</strong> {booking.phone}</li>
            <li><strong>Date:</strong> {booking.date}</li>
            <li><strong>Time:</strong> {booking.time}</li>
          </ul>
          <button onClick={() => handleCancel(index)} className="cancel-button">
            Cancel Booking
          </button>
        </div>
      ))}
    </div>
  );
};

export default BookingPage;
