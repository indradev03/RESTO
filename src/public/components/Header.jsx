import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/RestoLogo.png';
import checkoutIcon from '../../assets/checkout.png';
import menuIcon from '../../assets/application.png';
import loginIcon from '../../assets/login.png';
import logoutIcon from '../../assets/log-out.png';
import profileIcon from '../../assets/profile.png';
import homeIcon from '../../assets/home.png';
import menuPageIcon from '../../assets/menu.png';
import tableIcon from '../../assets/table.png';
import bookingIcon from '../../assets/booknow.png';
import '../../css/Header.css';

const Header = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [name, setName] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [hasNewBooking, setHasNewBooking] = useState(false);

    const popupRef = useRef(null);
    const menuButtonRef = useRef(null);
    const navigate = useNavigate();

    const togglePopup = () => setIsPopupOpen(!isPopupOpen);

    useEffect(() => {
        const role = localStorage.getItem('role');
        const email = localStorage.getItem('email');
        const storedName = localStorage.getItem('name');
        const storedImage = localStorage.getItem('profile_image_url');

        if (role) {
            setIsLoggedIn(true);
            setUserEmail(email || '');
            setName(storedName || '');
            setProfileImageUrl(storedImage || '');
        }
    }, []);

    useEffect(() => {
        const updateBookingStatus = () => {
            const bookingFlag = localStorage.getItem('hasNewBooking') === 'true';
            setHasNewBooking(bookingFlag);
        };
        updateBookingStatus();
        window.addEventListener('bookingStatusChanged', updateBookingStatus);
        return () => window.removeEventListener('bookingStatusChanged', updateBookingStatus);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target) &&
                !menuButtonRef.current.contains(event.target)
            ) {
                setIsPopupOpen(false);
            }
        };
        if (isPopupOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPopupOpen]);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate('/auth/login');
    };

    const handleBookingClick = () => {
        setHasNewBooking(false);
        localStorage.setItem('hasNewBooking', 'false');
        window.dispatchEvent(new Event('bookingStatusChanged'));
        navigate('/booking');
    };

    return (
        <div className="header-wrapper">
            <header className="MultiAppbar">
                <div className="logo">
                    <Link to="/">
                        <img src={logo} alt="Resto" width="170" height="170" />
                    </Link>
                </div>

                <nav>
                    <ul className="header-links">
                        <li><Link to="/Aboutus">About us</Link></li>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/SpecialOffers">Special Offers</Link></li>
                        <li><Link to="/menu">Menu</Link></li>
                        <li><Link to="/tables">Tables</Link></li>
                    </ul>
                </nav>

                <div className="auth-buttons">
                    {isLoggedIn ? (
                        <button className="userlogoutbtn" onClick={handleLogout}>Logout</button>
                    ) : (
                        <button className="login-btn" onClick={() => navigate('/auth/login')}>Login</button>
                    )}
                </div>

                <div className="header-icons">
                    <button onClick={handleBookingClick} className="booking-icon-button" aria-label="Booking">
                        <img src={checkoutIcon} alt="Booking Icon" />
                        {hasNewBooking && <span className="notification-badge"></span>}
                    </button>

                    <button id="menuButton" ref={menuButtonRef} onClick={togglePopup} aria-label="Menu">
                        <img src={menuIcon} alt="More Icon" />
                    </button>

                    {isPopupOpen && (
                        <div id="popupMenu" ref={popupRef}>
                            {isLoggedIn ? (
                                <>
                                    <Link to="/profile/edit" className="popup-link" onClick={() => setIsPopupOpen(false)}>
                                        <img
                                            src={profileImageUrl   || profileIcon}
                                            alt="Profile"
                                            className="popup-profile-img"
                                        />
                                        {name || 'Profile'}
                                    </Link>

                                    <button type='button' className="popup-link" onClick={handleLogout}>
                                        <img src={logoutIcon} alt="Logout Icon" /> Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/auth/login" className="popup-link" onClick={() => setIsPopupOpen(false)}>
                                    <img src={loginIcon} alt="Login Icon" /> Login
                                </Link>
                            )}

                            <Link to="/" className="popup-link" onClick={() => setIsPopupOpen(false)}>
                                <img src={homeIcon} alt="Home Icon" /> Home
                            </Link>
                            <Link to="/menu" className="popup-link" onClick={() => setIsPopupOpen(false)}>
                                <img src={menuPageIcon} alt="Menu Icon" /> Menu
                            </Link>
                            <Link to="/tables" className="popup-link" onClick={() => setIsPopupOpen(false)}>
                                <img src={tableIcon} alt="Tables Icon" /> Tables
                            </Link>
                            <Link to="/booking" className="popup-link" onClick={() => setIsPopupOpen(false)}>
                                <img src={bookingIcon} alt="Booking Icon" /> Booking
                            </Link>
                        </div>
                    )}
                </div>
            </header>
        </div>
    );
};

export default Header;