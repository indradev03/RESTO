import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import '../../css/AuthPage.css';

const LoginForm = ({ email, password, role, setEmail, setPassword, setRole, setView, setError, error }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
    e.preventDefault();

    // Retrieve registered users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Find user with matching email, password, and role
    const foundUser = storedUsers.find(
        (user) => user.email === email && user.password === password && user.role === role
    );

    if (foundUser) {
      // Save session data
        localStorage.setItem("role", foundUser.role);
        localStorage.setItem("email", foundUser.email);
        navigate(foundUser.role === "admin" ? "/admin" : "/user");
    } else {
        setError("Invalid credentials for selected role");
    }
    };

    return (
    <>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password:</label>
        <div className="password-input-container">
        <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <span
            className="toggle-password-icon"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setShowPassword(!showPassword);
            }}
        >
            {showPassword ? <FiEye /> : <FiEyeOff />}
        </span>
        </div>

        <label className="role-label">Login As:</label>
        <select
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

    <div className="forgot-password-container">
        <span
        onClick={() => {
            setView('forgot');
            setError('');
        }}
        >
        Forgot Password?
        </span>
    </div>

    <p>
        Don't have an account?{' '}
        <span
            onClick={() => {
            setView('signup');
            setError('');
            }}
        >
            Create Account
        </span>
    </p>
    </>
    );
};

export default LoginForm;
