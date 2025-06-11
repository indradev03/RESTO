import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <button onClick={() => navigate('/admin/add-product')}>Add Products</button>
      <button onClick={() => navigate('/admin/add-table')}>Add Table</button>
      <button onClick={() => navigate('/admin/see-booking')}>See Booking</button>
      <button onClick={() => navigate('/admin/profile')}>Profile</button>
      <button className="logout-btn" onClick={onLogout}>Logout</button>
    </nav>
  );
};

export default Sidebar;
