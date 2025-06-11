import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import StatCard from './StatCard';
import RecentActivity from './RecentActivity';
import './AdminDashboard.css';
import { FaBoxOpen, FaTable, FaCalendarAlt, FaUsers } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={handleLogout} />

      <main className="dashboard-main">
        <DashboardHeader />

        <div className="stat-grid">
          <StatCard icon={<FaBoxOpen />} label="Total Products" value="247" bg="#10b981" />
          <StatCard icon={<FaTable />} label="Active Tables" value="32" bg="#3b82f6" />
          <StatCard icon={<FaCalendarAlt />} label="Today's Bookings" value="18" bg="#8b5cf6" />
          <StatCard icon={<FaUsers />} label="Active Users" value="156" bg="#f97316" />
        </div>

        <RecentActivity />
      </main>
    </div>
  );
};

export default AdminDashboard;
