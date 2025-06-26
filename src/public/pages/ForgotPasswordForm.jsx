    import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import '../../css/AuthPage.css';

    const ForgotPasswordForm = ({ email, setEmail, submitted, setSubmitted, setError }) => {
    const navigate = useNavigate();

    const handleForgotPassword = (e) => {
        e.preventDefault();
        console.log('Reset link sent to:', email);
        setSubmitted(true);

        // Optional: fake error handling
        setError?.('');
    };

    const handleBackToLogin = () => {
        setSubmitted(false);
        setError?.('');
        navigate('/auth/login');
    };

    return (
        <>
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>

            {!submitted ? (
                <form onSubmit={handleForgotPassword}>
                <label>Email:</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Send Reset Link</button>
                </form>
            ) : (
                <p className="success-message">A reset link has been sent to your email.</p>
            )}
        </div>

        <hr />


        <div className="forgot-password-container-button">
            <p>
                Remembered your password?{' '}
                <span
                role="button"
                tabIndex={0}
                onClick={handleBackToLogin}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleBackToLogin();
                }}
                >
                Back to Login
                </span>
            </p>
        </div>
        </>
    );
    };

    export default ForgotPasswordForm;
    // This component handles the forgot password functionality.