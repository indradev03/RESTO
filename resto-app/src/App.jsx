// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './public/components/Header';
import Slideshow from './public/components/Slideshow';
import AboutSection from './public/components/AboutSection';
import MenuSection from './public/components/MenuSection';
import Footer from './public/components/Footer';

import AboutUs from './public/pages/Aboutus';
import SpecialOffers from './public/pages/SpecialOffers';
import Jobs from './public/pages/Jobs';
import Contact from './public/pages/Contact';
import Menu from './public/pages/Menu';

// import LoginPage from './public/pages/LoginPage';
// import SignupPage from './public/pages/SignupPage';
// import ForgotPassword from './public/pages/ForgotPassword';
import StepsForBooking from './public/pages/StepsForBooking';

import AdminDashboard from './public/pages/Admin/AdminDashboard';   
import UserDashboard from './public/pages/UserDashboard';     

import TableBooking from './public/pages/TableBooking';
import BookingProcessPage from "./public/pages/BookingProcessPage"; 

import BookingPage from './public/pages/BookingPage';
import AuthPage from './public/pages/AuthPage';

// Home section (used on "/")
const Home = () => (
  <>
    <Slideshow />
    <AboutSection />
    <MenuSection />
    
  </>
);

// Layout that conditionally includes Header and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith('/admin') || location.pathname.startsWith('/user');

  return (
    <>
      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
};

const App = () => {
  return (

      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Aboutus" element={<AboutUs />} />
          <Route path="/specialoffers" element={<SpecialOffers />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/booking" element={<BookingPage />} />  
          {/* <Route path="/login" element={<LoginPage />} />        */} 
          <Route path="/login" element={<AuthPage />} />
          {/* <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} /> */}
          <Route path="/stepsforbooking" element={<StepsForBooking />} />
          <Route path="/admin" element={<AdminDashboard />} />      
          <Route path="/user" element={<UserDashboard />} />       
          <Route path='/tables' element ={ <TableBooking/> } />
          <Route path="/book/:tableId" element={<BookingProcessPage />} />
        </Routes>
      </Layout>

  );
};

export default App;
