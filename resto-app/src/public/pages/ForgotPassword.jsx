    // src/pages/ForgotPassword.jsx
    import React, { useState } from 'react';
    import { Link } from 'react-router-dom';
    import '../../css/ForgotPassword.css';

    const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here, add logic to send reset link
        console.log('Reset link sent to:', email);
        setSubmitted(true);
    };

    return (
        <div className="forgot-password-container">
        <div className="forgot-password-modal-content">
            <h2>Forgot Password</h2>
            {!submitted ? (
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                type="email"
                required
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Send Reset Link</button>
            </form>
            ) : (
            <p className="success-message">A reset link has been sent to your email.</p>
            )}
            <hr />
            <p>Remembered your password? <Link to="/login">Back to Login</Link></p>
        </div>
        </div>
    );
    };

    export default ForgotPassword;
