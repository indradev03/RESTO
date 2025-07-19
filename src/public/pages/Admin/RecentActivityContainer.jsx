import React, { useEffect, useState } from 'react';
import RecentActivity from './RecentActivity';

const RecentActivityContainer = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/recent-activities');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        // Assuming your backend sends 'created_at' as timestamp field
        // Map backend field created_at to timestamp for RecentActivity component
        const formattedData = data.map(activity => ({
          ...activity,
          timestamp: activity.created_at,  // map DB field to component prop name
        }));

        setActivities(formattedData);
        setError(null);
      } catch (err) {
        setError('Failed to load recent activities.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) return <p>Loading recent activities...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return <RecentActivity activities={activities} />;
};

export default RecentActivityContainer;
