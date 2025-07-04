import React, { useEffect, useState } from 'react';
import StatCard from './StatCard';
import { FaBoxOpen, FaTable, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    tables: 0,
    bookingsToday: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/stats');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        console.log('📊 Stats fetched:', data);

        // Defensive: make sure all keys exist and are numbers
        setStats({
          products: Number(data.products) || 0,
          tables: Number(data.tables) || 0,
          bookingsToday: Number(data.bookingsToday) || 0,
          users: Number(data.users) || 0,
        });
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching stats:', err);
        setError('Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="loading">Loading dashboard stats...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard-container">
      <div className="stat-grid">
        <StatCard icon={<FaBoxOpen />} label="Total Products" value={stats.products} bg="#10b981" />
        <StatCard icon={<FaTable />} label="Active Tables" value={stats.tables} bg="#3b82f6" />
        <StatCard icon={<FaCalendarAlt />} label="Today's Bookings" value={stats.bookingsToday} bg="#8b5cf6" />
        <StatCard icon={<FaUsers />} label="Active Users" value={stats.users} bg="#f97316" />
      </div>
    </div>
  );
};

export default AdminDashboard;
