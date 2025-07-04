import React, { useEffect, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa'; // Import trash icon
import './TotalUsers.css';

const TotalUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users');
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch users');
      }
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    setDeletingUserId(userId); // Show loading state on delete icon or disable it

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete user');
      }

      // Remove deleted user from state list
      setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userId));
    } catch (err) {
      alert(`Error deleting user: ${err.message}`);
    } finally {
      setDeletingUserId(null);
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (users.length === 0) return <div className="no-users">No users found.</div>;

  return (
    <div className="total-users-container">
      <h2>All Users</h2>
      <div className="users-grid">
        {users.map((user) => (
          <div key={user.user_id} className="user-card">
            <div className="avatar-wrapper">
              {user.profile_image_url ? (
                <img
                  src={`http://localhost:5000${user.profile_image_url}`}
                  alt={`${user.name}'s profile`}
                  className="avatar"
                />
              ) : (
                <div className="avatar placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="user-info">
              <h3>{user.name}</h3>
              <p className="email">
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </p>
              <p>
                <strong>Contact:</strong> {user.contact || '-'}
              </p>
              <p className="address"><strong>Address: </strong>{user.address || '-'}</p>
            </div>
            <button
              className="delete-btn"
              onClick={() => handleDelete(user.user_id)}
              disabled={deletingUserId === user.user_id}
              aria-label={`Delete user ${user.name}`}
              title="Delete user"
            >
              <FaTrashAlt />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalUsers;
