import React from 'react';
import '../../css/AuthPage.css';
const ForgotPasswordForm = ({ email, setEmail, submitted, setSubmitted, setView }) => {

    const handleForgotPassword = (e) => {
        e.preventDefault();
        console.log('Reset link sent to:', email);
        setSubmitted(true);
    };

    return (
        <>
            <h2>Forgot Password</h2>
            {!submitted ? (
                <form onSubmit={handleForgotPassword}>
                    <label>Email:</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <button type="submit">Send Reset Link</button>
                </form>
            ) : (
                <p className="success-message">A reset link has been sent to your email.</p>
            )}
            <hr />
            <p>
                Remembered your password? <span onClick={() => { setView('login'); setSubmitted(false); }}>Back to Login</span>
            </p>
        </>
    );
};

export default ForgotPasswordForm;
