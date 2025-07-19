import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/AuthPage.css';

const ForgotPasswordForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to send reset link.');
        setLoading(false);
        return;
      }

      setSubmitted(true);
      toast.success('Reset link sent. Check your email.');
    } catch (err) {
      toast.error('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setSubmitted(false);
    navigate('/auth/login');
  };

  return (
    <>
      <div className="forgot-password-container" role="main">
        <h2>Forgot Password</h2>

        {!submitted ? (
          <form onSubmit={handleForgotPassword} noValidate>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
              aria-label="Email address"
            />

            <button className="sendlink-button" type="submit" disabled={loading || !email.trim()}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <p className="success-message" role="alert">
            If the email exists, a reset link has been sent. Please check your inbox.
          </p>
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
            className="back-to-login-link"
          >
            Back to Login
          </span>
        </p>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default ForgotPasswordForm;
