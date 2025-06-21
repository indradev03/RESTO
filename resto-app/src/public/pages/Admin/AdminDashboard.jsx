import React from 'react';
import StatCard from './StatCard';
import RecentActivity from './RecentActivity';
import { FaBoxOpen, FaTable, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <>
    <div className='admin-dashboard-container'>
      <div className="stat-grid">
        <StatCard icon={<FaBoxOpen />} label="Total Products" value="247" bg="#10b981" />
        <StatCard icon={<FaTable />} label="Active Tables" value="32" bg="#3b82f6" />
        <StatCard icon={<FaCalendarAlt />} label="Today's Bookings" value="18" bg="#8b5cf6" />
        <StatCard icon={<FaUsers />} label="Active Users" value="156" bg="#f97316" />
      </div>
      <RecentActivity />
    </div>

    </>
  );
};

export default AdminDashboard;
