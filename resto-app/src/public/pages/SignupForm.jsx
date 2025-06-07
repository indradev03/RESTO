import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import '../../css/AuthPage.css';

const SignupForm = ({
  name,
  email,
  password,
  confirmPassword,
  setName,
  setEmail,
  setPassword,
  setConfirmPassword,
  setView,
  setError,
  error,
}) => {
  const navigate = useNavigate();

  // States to toggle password visibility for both fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    console.log('Signup data:', { name, email, password });
    navigate('/login');
  };

  return (
    <>
      <h2>Create Account</h2>
      <form onSubmit={handleSignup} noValidate>
        <label htmlFor="signup-name">Name:</label>
        <input
          id="signup-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="signup-email">Email:</label>
        <input
          id="signup-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="signup-password">Password:</label>
        <div className="password-input-container">
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="toggle-password-icon"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowPassword((prev) => !prev);
              }
            }}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <label htmlFor="signup-confirm-password">Confirm Password:</label>
        <div className="password-input-container">
          <input
            id="signup-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            className="toggle-password-icon"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowConfirmPassword((prev) => !prev);
              }
            }}
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <button type="submit">Sign Up</button>
      </form>

      {error && <p className="error">{error}</p>}

      <hr />

      <p>
        Already have an account?{' '}
        <span
          tabIndex={0}
          role="button"
          onClick={() => {
            setView('login');
            setError('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setView('login');
              setError('');
            }
          }}
        >
          Login
        </span>
      </p>
    </>
  );
};

export default SignupForm;
