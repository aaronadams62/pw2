import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Hero from './components/hero/hero';
import About from './components/about/about';
import Portfolio from './components/portfolio/portfolio';
import Skills from './components/skills/skills';
import Testimonials from './components/testimonials/testimonials';
import Contact from './components/contact/contact';
import Footer from './components/footer/footer';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import NotFound from './components/errors/NotFound';
import ErrorBoundary from './components/errors/ErrorBoundary';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import './App.css';

library.add(fab);

function MainSite() {
  const [theme, setTheme] = useState('night');
  const toggleTheme = () => setTheme(theme === 'night' ? 'day' : 'night');

  return (
    <div className="AaronFolio2.0" data-theme={theme}>
      {/* Passing theme props to Header, will need to update Header to use them if we want the toggle there */}
      <Header theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <About />
      <Portfolio />
      <Skills />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

function App() {
  useEffect(() => {
    const id = process.env.REACT_APP_GA_MEASUREMENT_ID;
    if (!id) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', id);
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<MainSite />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
