import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div style={styles.container}>
            <h1>Welcome to the Admin Dashboard</h1>
            <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
            </button>
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        textAlign: 'center',
    },
    logoutButton: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#d9534f',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default AdminDashboard;
