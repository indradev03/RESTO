import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/SignupPage.css';

const SignupPage = () => {
    return (
        <div className="modal" id="signupModal">
            <div className="modal-content">
                <h2>Create Account</h2>
                <form>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Enter Your Name"
                        required
                    />

                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter Your Email"
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter Your Password"
                        required
                    />

                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm Your Password"
                        required
                    />

                    <button type="submit">Sign Up</button>
                </form>

                <hr />

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
