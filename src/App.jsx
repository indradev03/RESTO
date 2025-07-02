// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

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

import AddProduct from './public/pages/Admin/AddProduct';
import AddTable from './public/pages/Admin/AddTable';
import AdminLayout from './public/pages/Admin/AdminLayout'; // You need to create this

import EditProfile from './public/pages/EditProfile'; // Import the EditProfile component
import SeeBooking from './public/pages/Admin/SeeBooking'; // Adjust path accordingly

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
          <Route path="/profile/edit" element={<EditProfile />} />

          {/* <Route path="/login" element={<LoginPage />} />        */} 
          {/* Route-based Auth Pages */}
          <Route path="/auth/:view" element={<AuthPage />} />
          <Route path="/auth" element={<Navigate to="/auth/login" replace />} />


          {/* <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} /> */}
          <Route path="/stepsforbooking" element={<StepsForBooking />} />

          {/* Admin Nested Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} /> {/* /admin */}
            <Route path="add-product" element={<AddProduct />} /> {/* /admin/add-product */}
            <Route path="add-table" element={<AddTable />} /> {/* /admin/add-table */}
            <Route path="see-booking" element={<SeeBooking />} /> {/* /admin/see-booking */}
            {/* Add more admin pages here if needed */}
          </Route>

  
  
          <Route path="/user" element={<UserDashboard />} />       
          <Route path='/tables' element ={ <TableBooking/> } />
          <Route path="/book/:tableId" element={<BookingProcessPage />} />
          
        </Routes>
      </Layout>

  );
};

export default App;
