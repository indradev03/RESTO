import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTable, FaCalendarCheck, FaUser, FaSignOutAlt, FaHome, FaShoppingBag } from 'react-icons/fa';
import './Sidebar.css';
import { FaChair, FaDiamondTurnRight, FaTableCells, FaTabletScreenButton } from 'react-icons/fa6';
import AddProduct from '../../../assets/addproduct.png';
import addtables from '../../../assets/addtables.png';

const Sidebar = ({ onLogout }) => {
const navigate = useNavigate();

  return (
    <div className="sidebar-wrapper">
      <nav className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>

        <button onClick={() => navigate('/admin/')} className="icon-button"> 
          <FaHome className="icon" /> Home
        </button>

        <button onClick={() => navigate('/admin/add-product')} className="icon-button">
          <img src={AddProduct} alt="add product" />
          Add Products
        </button>

        <button onClick={() => navigate('/admin/add-table')} className="icon-button">
          <img src={addtables} alt="add tables" />
          Add Tables
        </button>

        <button onClick={() => navigate('/admin/see-booking')} className="icon-button">
          <FaCalendarCheck className="icon" /> See Booking
        </button>

        <button onClick={() => navigate('/admin/totalusers')} className="icon-button">
          <FaUser className="icon" /> Users
        </button>
      </nav>

      {/* Logout button outside the nav */}
      <button className="logout-btn" onClick={onLogout}>
        <FaSignOutAlt className="icon" /> Logout
      </button>
    </div>
  );

};

export default Sidebar;
