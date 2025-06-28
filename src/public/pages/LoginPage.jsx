    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { FiEye, FiEyeOff } from 'react-icons/fi';
    import '../../css/AuthPage.css';

    const LoginForm = ({
    email,
    password,
    role,
    setEmail,
    setPassword,
    setRole,
    setError,
    error,
    }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const loginUrl =
        role === 'admin'
            ? 'http://localhost:5000/api/admin/login'
            : 'http://localhost:5000/api/auth/login';

        const payload =
        role === 'admin'
            ? { emailOrUsername: email, password }
            : { email, password };

        try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            setError(result.message || 'Login failed');
        } else {
            // ✅ Destructure token and email (if returned)
            const { token, email: returnedEmail } = result;

            // ✅ Save to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('email', returnedEmail || email); // Sidebar uses this

            // ✅ Navigate to appropriate dashboard
            navigate(role === 'admin' ? '/admin' : '/user');
        }
        } catch (err) {
        setError('Network error. Please try again.');
        } finally {
        setLoading(false);
        }
    };

    const handleNavigate = (path) => {
        setError('');
        navigate(`/auth/${path}`);
    };

    return (
        <>
        <h2>Login</h2>
        <form onSubmit={handleLogin} noValidate>
            <label>{role === 'admin' ? 'Email or Username:' : 'Email:'}</label>
            <input
            type="text"
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
                onClick={() => setShowPassword((prev) => !prev)}
                role="button"
                tabIndex={0}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowPassword((prev) => !prev);
                }
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

            <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>

        {error && <p className="error">{error}</p>}

        <hr />

        <div className="forgot-password-container">
            <span
            role="button"
            tabIndex={0}
            onClick={() => handleNavigate('forgot')}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleNavigate('forgot');
            }}
            >
            Forgot Password?
            </span>
        </div>

        <div className="signup-container-button">
            <p>
            Don't have an account?{' '}
            <span
                role="button"
                tabIndex={0}
                onClick={() => handleNavigate('signup')}
                onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleNavigate('signup');
                }}
            >
                Create Account
            </span>
            </p>
        </div>
        </>
    );
    };

    export default LoginForm;
