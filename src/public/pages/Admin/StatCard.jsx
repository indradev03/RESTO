import React from 'react';
import './StatCard.css';

const StatCard = ({ icon, label, value, bg }) => {
  return (
    <div className="stat-card" style={{ backgroundColor: bg }}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-content">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">{value}</div>
      </div>
    </div>
  );
};

export default StatCard;



