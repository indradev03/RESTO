    import React, { useState, useEffect } from 'react';
    import LoginForm from '../pages/LoginPage';
    import SignupForm from '../pages/SIgnupForm';
    import ForgotPasswordForm from '../pages/ForgotPasswordForm';
    import '../../css/AuthPage.css';

    const AuthPage = () => {
    const [view, setView] = useState('login');
    const [nextView, setNextView] = useState(null);
    const [animating, setAnimating] = useState(false);

    // form fields and errors states as before
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('admin');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    

    // handle view change with animation
    const handleChangeView = (newView) => {
        if (newView === view) return; // no change
        setNextView(newView);
        setAnimating(true);
    };

    // After animation ends, switch the view
    useEffect(() => {
        if (animating) {
        const timer = setTimeout(() => {
            setView(nextView);
            setNextView(null);
            setAnimating(false);
        }, 300); // match animation duration in CSS
        return () => clearTimeout(timer);
        }
    }, [animating, nextView]);

    return (
        <div className="modal" id="authModal">
        <div className="login-wrapper">
            <div className="image-side"></div>
            <div className={`auth-content ${animating ? 'fade-out' : 'fade-in'}`}>
            {view === 'login' && (
                <LoginForm
                    email={email}
                    password={password}
                    role={role}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    setRole={setRole}
                    setView={handleChangeView} // use new handler
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
                    setView={handleChangeView} // use new handler
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
                    setView={handleChangeView} // use new handler
                />
            )}
            </div>
        </div>
        </div>
    );
    };

    export default AuthPage;
