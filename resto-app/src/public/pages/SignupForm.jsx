import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import '../../css/AuthPage.css';

const SignupForm = ({ setView, setError, error }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError: setFormError,
    clearErrors,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(''); // ✅ For success message

  const password = watch('password', '');

  const onSubmit = (data) => {
    clearErrors('confirmPassword');
    setSuccess('');
    setError('');

    if (data.password !== data.confirmPassword) {
      setFormError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      setError('Passwords do not match');
      return;
    }

    const newUser = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'user', // default role
    };

    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = existingUsers.some(user => user.email === data.email);
    if (userExists) {
      setError('Email already registered');
      return;
    }

    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    setSuccess('Account created successfully');
    setError('');

    setTimeout(() => {
      setView('login');
    }, 1000);
  };

  return (
    <>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="signup-name">Name:</label>
        <input
          id="signup-name"
          type="text"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p className="error">{errors.name.message}</p>}

        <label htmlFor="signup-email">Email:</label>
        <input
          id="signup-email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <label htmlFor="signup-password">Password:</label>
        <div className="password-input-container">
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 6 characters',
              },
            })}
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
            {showPassword ? <FiEye /> : <FiEyeOff />}
          </span>
        </div>
        {errors.password && <p className="error">{errors.password.message}</p>}

        <label htmlFor="signup-confirm-password">Confirm Password:</label>
        <div className="password-input-container">
          <input
            id="signup-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
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
            {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
          </span>
        </div>
        {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}

        <button type="submit">Sign Up</button>
      </form>

      {error && !errors.confirmPassword && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>} {/* ✅ success message */}

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
