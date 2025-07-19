import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './ResetPassword.css'; // update your CSS accordingly

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to reset password');
      } else {
        toast.success('Password reset successful! Redirecting to login...');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => navigate('/auth/login'), 2000);
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error. Please try again later.');
    }
  };

  if (!token) {
    return (
      <div className="fp-reset-container">
        <p className="fp-reset-error">Invalid or expired reset link.</p>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    );
  }

  return (
    <div className="fp-reset-container">
      <h2 className="fp-reset-title">Reset Your Password</h2>
      <form onSubmit={handleSubmit} className="fp-reset-form" noValidate>
        <div className="fp-form-group">
          <label htmlFor="new-password" className="fp-form-label">
            New Password
          </label>
          <div className="fp-input-with-icon">
            <input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              aria-label="New password"
              className="fp-form-input"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="fp-icon-button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="fp-form-group">
          <label htmlFor="confirm-password" className="fp-form-label">
            Confirm Password
          </label>
          <div className="fp-input-with-icon">
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              aria-label="Confirm password"
              className="fp-form-input"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="fp-icon-button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button type="submit" className="fp-btn-submit">
          Reset Password
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
