    import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import useAuthRedirect from '../../backend/hooks/useAuthRedirect'; 
    import Header from '../../public/components/Header';
    import Slideshow from '../../public/components/Slideshow';
    import AboutSection from '../../public/components/AboutSection';
    import MenuSection from '../../public/components/MenuSection';
    import Footer from '../../public/components/Footer';

    const UserDashboard = () => {
    const navigate = useNavigate();

    // 🔐 Redirect if not logged in or not a user
    useAuthRedirect('user');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        navigate('/auth/login');
    };

    return (
        <div>
        {/* You can add a logout button in the Header or here if needed */}
        <Header />
        <Slideshow />
        <AboutSection />
        <MenuSection />
        <Footer />
        </div>
    );
    };

    export default UserDashboard;
