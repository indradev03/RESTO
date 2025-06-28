import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarCheck,
  FaUser,
  FaSignOutAlt,
  FaHome,
} from 'react-icons/fa';
import './Sidebar.css';
import AddProduct from '../../../assets/addproduct.png';
import addtables from '../../../assets/addtables.png';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      const email = localStorage.getItem('email');
      if (!email) {
        setLoading(false);
        return;
      }

      try {
        // ✅ Corrected endpoint
        const res = await fetch(`http://localhost:5000/api/admin/email/${email}`);
        if (!res.ok) {
          const errorData = await res.json();
          console.error('Error fetching admin:', errorData.message || 'Unknown error');
          setLoading(false);
          return;
        }

        const data = await res.json();
        setAdmin({ username: data.username, email: data.email });
      } catch (err) {
        console.error('Fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('token');

    if (typeof onLogout === 'function') {
      onLogout();
    }

    navigate('/auth/login');
  };

  return (
    <div className="sidebar-wrapper">
      <nav className="sidebar">
        <div className="admin-info">
          {loading ? (
            <div className="loading">Loading admin...</div>
          ) : admin.username ? (
            <div className="admin-text">
              <span className="admin-username">{admin.username}</span>
              <span className="admin-email">{admin.email}</span>
            </div>
          ) : (
            <div className="error">Failed to load admin</div>
          )}
        </div>

        <button onClick={() => navigate('/admin/')} className="icon-button">
          <FaHome className="icon" /> Home
        </button>

        <button onClick={() => navigate('/admin/add-product')} className="icon-button">
          <img src={AddProduct} alt="Add Product" className="sidebar-img-icon" />
          Add Products
        </button>

        <button onClick={() => navigate('/admin/add-table')} className="icon-button">
          <img src={addtables} alt="Add Tables" className="sidebar-img-icon" />
          Add Tables
        </button>

        <button onClick={() => navigate('/admin/see-booking')} className="icon-button">
          <FaCalendarCheck className="icon" /> See Booking
        </button>

        <button onClick={() => navigate('/admin/totalusers')} className="icon-button">
          <FaUser className="icon" /> Users
        </button>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt className="icon" /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
