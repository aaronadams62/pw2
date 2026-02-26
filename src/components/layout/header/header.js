import React, { useState } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import './header.css'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar__brand">
          <a href="/">AaronAdams.dev</a>
        </div>

        <button
          className="navbar__hamburger"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar__links ${mobileMenuOpen ? 'navbar__links--open' : ''}`}>
          <ul>
            <li><a href="#hero" onClick={closeMobileMenu}>Home</a></li>
            <li><a href="#about" onClick={closeMobileMenu}>About</a></li>
            <li><a href="#portfolio" onClick={closeMobileMenu}>Portfolio</a></li>
            <li><a href="#skills" onClick={closeMobileMenu}>Skills</a></li>
            <li><a href="#testimonials" onClick={closeMobileMenu}>Testimonials</a></li>
            <li><a href="#contact" onClick={closeMobileMenu}>Contact</a></li>
          </ul>
        </div>

        <button
          className="navbar__theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'night' ? 'light' : 'dark'} mode`}
        >
          {theme === 'night' ? '☀️' : '🌙'}
        </button>
      </nav>
    </header>
  );
}

export default Header;
