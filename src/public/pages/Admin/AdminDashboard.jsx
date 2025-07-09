import React, { useEffect, useState } from 'react';
import StatCard from './StatCard';
import DashboardCharts from './DashboardCharts';
import RecentActivity from './RecentActivity';
import { FaBoxOpen, FaTable, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    tables: 0,
    bookingsToday: 0,
    users: 0,
  });

  const [activities, setActivities] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [activitiesError, setActivitiesError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/stats');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (isMounted) {
          setStats({
            products: Number(data.products) || 0,
            tables: Number(data.tables) || 0,
            bookingsToday: Number(data.bookingsToday) || 0,
            users: Number(data.users) || 0,
          });
          setStatsError(null);
        }
      } catch (err) {
        console.error('❌ Error fetching stats:', err);
        if (isMounted) setStatsError('Failed to load dashboard stats.');
      } finally {
        if (isMounted) setStatsLoading(false);
      }
    };

    const fetchActivities = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/recent-activities');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (isMounted) {
          setActivities(data);
          setActivitiesError(null);
        }
      } catch (err) {
        console.error('❌ Error fetching recent activities:', err);
        if (isMounted) setActivitiesError('Failed to load recent activities.');
      } finally {
        if (isMounted) setActivitiesLoading(false);
      }
    };

    fetchStats();
    fetchActivities();

    return () => {
      isMounted = false;
    };
  }, []);

  // New: delete handler for recent activities
  const handleDeleteActivity = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/recent-activities/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete activity');
      }

      // Remove deleted activity from state to update UI
      setActivities((prev) => prev.filter((activity) => activity.id !== id));
    } catch (err) {
      console.error('❌ Delete activity error:', err);
      alert('Failed to delete activity: ' + err.message);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="stat-grid">
        {statsLoading ? (
          <p>Loading dashboard stats...</p>
        ) : statsError ? (
          <p className="error">{statsError}</p>
        ) : (
          <>
            <StatCard icon={<FaBoxOpen />} label="Total Products" value={stats.products} bg="#10b981" />
            <StatCard icon={<FaTable />} label="Active Tables" value={stats.tables} bg="#3b82f6" />
            <StatCard icon={<FaCalendarAlt />} label="Today's Bookings" value={stats.bookingsToday} bg="#8b5cf6" />
            <StatCard icon={<FaUsers />} label="Active Users" value={stats.users} bg="#f97316" />
          </>
        )}
      </div>

      {!statsLoading && !statsError && <DashboardCharts stats={stats} />}

      <section className="recent-activities-section">
        {activitiesLoading ? (
          <p>Loading recent activities...</p>
        ) : activitiesError ? (
          <p className="error">{activitiesError}</p>
        ) : (
          <RecentActivity activities={activities} onDelete={handleDeleteActivity} />
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
