import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const SignupForm = ({ setView, setError, error }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError: setFormError,
    clearErrors,
    reset,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const password = watch('password', '');

  const onSubmit = async (data) => {
    clearErrors('confirmPassword');
    setError('');
    setSuccess('');

    if (data.password !== data.confirmPassword) {
      setFormError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role: 'user' }),
      });

      const result = await res.json();

      if (!res.ok) {
        // Backend error sent in result.error
        setError(result.error || 'Signup failed');
        setLoading(false);
        return;
      }

      setSuccess('Account created successfully!');
      reset();
      setTimeout(() => {
        setView('login');
        setError('');
      }, 1500);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="signup-title">Create Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="signup-form">
        <div className="signup-columns">
          {/* Left Column */}
          <div className="signup-column">
            <label className="signup-label">Name:</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="signup-input"
            />
            {errors.name && <p className="signup-error">{errors.name.message}</p>}

            <label className="signup-label">Email:</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: 'Invalid email address',
                },
              })}
              className="signup-input"
            />
            {errors.email && <p className="signup-error">{errors.email.message}</p>}

            <label className="signup-label">Contact Number:</label>
            <input
              type="text"
              {...register('contact', {
                required: 'Contact number is required',
                pattern: {
                  value: /^[0-9]{10,}$/,
                  message: 'Enter a valid contact number',
                },
              })}
              className="signup-input"
            />
            {errors.contact && <p className="signup-error">{errors.contact.message}</p>}
          </div>

          {/* Right Column */}
          <div className="signup-column">
            <label className="signup-label">Address:</label>
            <input
              type="text"
              {...register('address', { required: 'Address is required' })}
              className="signup-input"
            />
            {errors.address && <p className="signup-error">{errors.address.message}</p>}

            <label className="signup-label">Password:</label>
            <div className="signup-password-wrapper" style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
                className="signup-input"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                role="button"
                tabIndex={0}
                className="signup-password-toggle"
                style={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowPassword((prev) => !prev);
                  }
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </span>
            </div>
            {errors.password && <p className="signup-error">{errors.password.message}</p>}

            <label className="signup-label">Confirm Password:</label>
            <div className="signup-password-wrapper" style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
                className="signup-input"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                role="button"
                tabIndex={0}
                className="signup-password-toggle"
                style={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowConfirmPassword((prev) => !prev);
                  }
                }}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="signup-error">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading} className="signup-button">
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      {error && !errors.confirmPassword && <p className="signup-error">{error}</p>}
      {success && <p className="signup-success">{success}</p>}

      <hr className="signup-divider" />

      <p className="signup-switch-text">
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
          className="signup-switch-link"
        >
          Login
        </span>
      </p>
    </>
  );
};

export default SignupForm;
