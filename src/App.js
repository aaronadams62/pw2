import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/header/header';
import Hero from './components/sections/hero/hero';
import About from './components/sections/about/about';
import Portfolio from './components/sections/portfolio/portfolio';
import Skills from './components/sections/skills/skills';
import Testimonials from './components/sections/testimonials/testimonials';
import Contact from './components/sections/contact/contact';
import Footer from './components/layout/footer/footer';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import NotFound from './components/errors/NotFound';
import ErrorBoundary from './components/errors/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useTheme } from './hooks/useTheme';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import './App.css';

library.add(fab);

function MainSite() {
  const { theme } = useTheme();

  return (
    <div className="AaronFolio2.0" data-theme={theme}>
      <Header />
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
      <ThemeProvider>
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<MainSite />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
