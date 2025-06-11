import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../public/components/Header';
import Slideshow from '../../public/components/Slideshow';
import AboutSection from '../../public/components/AboutSection';
import MenuSection from '../../public/components/MenuSection';
import Footer from '../../public/components/Footer';

const UserDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'user') {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div>
            <Header />
            <Slideshow />
            <AboutSection />
            <MenuSection />
            <Footer />
        </div>
    );
};



export default UserDashboard;
