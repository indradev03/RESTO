import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Dummy credentials
        const credentials = {
            admin: { email: 'admin@example.com', password: 'admin123' },
            user: { email: 'user@example.com', password: 'user123' },
        };

        const selected = credentials[role];

        if (email === selected.email && password === selected.password) {
            sessionStorage.setItem('role', role);
            sessionStorage.setItem('email', email); // Save email in session
            navigate(role === 'admin' ? '/admin' : '/user');
        } else {
            setError('Invalid credentials for selected role');
        }
    };

    return (
        <div className="modal" id="loginModal">
            <div className="loginmodal-content">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter Your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <label htmlFor="role" className="role-label">Login As:</label>
                    <select
                        id="role"
                        className="role-select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>

                    <button type="submit">Login</button>
                </form>

                {error && <p className="error">{error}</p>}

                <hr />

                <div className="forgotpassword">
                    <Link to="/forgotpassword">Forgot Password?</Link>
                </div>

                <p>
                    Don't have an account? <Link to="/signup">Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
