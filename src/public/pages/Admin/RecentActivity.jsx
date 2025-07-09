import React from 'react';
import PropTypes from 'prop-types';
import './RecentActivity.css';

const typeColors = {
  product: '#10b981', // green
  user: '#3b82f6',    // blue
  booking: '#f59e0b', // amber
};

    const RecentActivity = ({ activities, onDelete }) => {
    if (!activities || activities.length === 0) {
        return (
        <section className="recent-activity no-activity-container" aria-live="polite">
            <p className="no-activity">No recent activity.</p>
        </section>
        );
    }

    return (
        <section className="recent-activity" aria-label="Recent Activity">
        <h3 className="title"> Recent Activity</h3>
        <ul className="activity-list">
            {activities.map(({ id, type, message, timestamp }) => {
            const time = timestamp ? new Date(timestamp) : null;
            const timeStr = time && !isNaN(time) ? time.toLocaleString() : 'Unknown time';

            return (
                <li key={id} className="activity-item" tabIndex={0} aria-describedby={`desc-${id}`}>
                <span
                    className="dot"
                    style={{ backgroundColor: typeColors[type] || 'Red' }}
                    aria-label={`${type} activity`}
                    role="img"
                />
                <div className="activity-content">
                    <p id={`desc-${id}`} className="activity-message">{message}</p>
                    <time className="activity-time" dateTime={timestamp || ''} title={timeStr}>
                    {timeStr}
                    </time>
                </div>
                <button
                    type="button"
                    className="delete-btn"
                    aria-label={`Delete activity: ${message}`}
                    onClick={() => onDelete(id)}
                    title="Delete activity"
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    width="20"
                    height="20"
                    aria-hidden="true"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                    />
                    </svg>
                </button>
                </li>
            );
            })}
        </ul>
        </section>
    );
    };

    RecentActivity.propTypes = {
    activities: PropTypes.arrayOf(
        PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        type: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        timestamp: PropTypes.string,
        })
    ),
    onDelete: PropTypes.func.isRequired,
    };

export default RecentActivity;
