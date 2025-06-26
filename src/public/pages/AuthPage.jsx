    import React, { useState, useEffect } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import LoginForm from '../pages/LoginPage';
    import SignupForm from '../pages/SignupForm';
    import ForgotPasswordForm from '../pages/ForgotPasswordForm';
    import '../../css/AuthPage.css';

    const AuthPage = () => {
    const { view } = useParams(); // login | signup | forgot
    const navigate = useNavigate();

    const [animating, setAnimating] = useState(false);
    const [nextView, setNextView] = useState(null);

    // Shared form states (optional, or handled inside forms)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    // Handles view switch with animation
    const handleChangeView = (newView) => {
        if (newView !== view) {
        setNextView(newView);
        setAnimating(true);
        }
    };

    // When animating ends, trigger route change
    useEffect(() => {
        if (animating && nextView) {
        const timer = setTimeout(() => {
            navigate(`/auth/${nextView}`);
            setAnimating(false);
            setNextView(null);
        }, 300); // Match your CSS fade duration
        return () => clearTimeout(timer);
        }
    }, [animating, nextView, navigate]);

    return (
        <div className="modal" id="authModal">
        <div className="login-wrapper">
            <div className="image-side" />
            <div className={`auth-content `}>
            {view === 'login' && (
                <LoginForm
                email={email}
                password={password}
                role={role}
                setEmail={setEmail}
                setPassword={setPassword}
                setRole={setRole}
                setView={handleChangeView}
                setError={setError}
                error={error}
                />
            )}

            {view === 'signup' && (
                <SignupForm
                name={name}
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                setName={setName}
                setEmail={setEmail}
                setPassword={setPassword}
                setConfirmPassword={setConfirmPassword}
                setView={handleChangeView}
                setError={setError}
                error={error}
                />
            )}

            {view === 'forgot' && (
                <ForgotPasswordForm
                email={email}
                setEmail={setEmail}
                submitted={submitted}
                setSubmitted={setSubmitted}
                setView={handleChangeView}
                setError={setError}
                error={error}
                />
            )}
            </div>
        </div>
        </div>
    );
    };

    export default AuthPage;
