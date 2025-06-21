import React from 'react';
import './RecentActivity.css';

const activities = [
  { label: 'New product added', detail: 'Grilled Salmon', time: '2 hours ago' },
  { label: 'Table booking confirmed', detail: 'Table #7', time: '3 hours ago' },
  { label: 'Menu updated', detail: 'Dessert section', time: '5 hours ago' },
  { label: 'Staff member added', detail: 'John Smith', time: '1 day ago' },
];

const RecentActivity = () => (
  <div className="recent-activity">
    <h2>Recent Activity</h2>
    <ul>
      {activities.map((act, i) => (
        <li key={i}>
          <p className="activity-label">{act.label}</p>
          <p className="activity-detail">{act.detail}</p>
          <span className="activity-time">{act.time}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentActivity;
