import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Banner from './components/Banner';
import About from './components/About';
import BookingForm from './components/BookingForm';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Coaching from './pages/Coaching';
import RateCard from './pages/RateCard';
import Membership from './pages/Membership';
import Contact from './pages/Contact';
import Login from './pages/Login';
import MyBookings from './pages/MyBookings';
import MyMembership from './pages/MyMembership';
import PrivacyPolicy from './pages/PrivacyPolicy';
import PaymentPolicy from './pages/PaymentPolicy';
import UsagePolicy from './pages/UsagePolicy';

import PaymentReturn from './pages/PaymentReturn';

function HomePage() {
  return (
    <>
      <Banner />
      <BookingForm />
      <About />
      <Gallery />
    </>
  );
}

function AdminRedirect() {
  useEffect(() => {
    const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:3002';
    window.location.href = adminUrl;
  }, []);

  return (
    <div className="container text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Redirecting to Admin Panel...</span>
      </div>
      <p className="mt-3">Redirecting to Admin Panel...</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="wrapper">
        <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} closeOnClick pauseOnHover style={{ top: '90px', zIndex: 10000 }} />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/coaching" element={<Coaching />} />
          <Route path="/rates" element={<RateCard />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/my-membership" element={<MyMembership />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/payment-policy" element={<PaymentPolicy />} />
          <Route path="/usage-policy" element={<UsagePolicy />} />
          <Route path="/payment-return" element={<PaymentReturn />} />
          <Route path="/admin" element={<AdminRedirect />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
