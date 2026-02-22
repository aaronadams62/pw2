import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p>&copy; 2023 AaronAdams.dev. All rights reserved.</p>
        <div className="footer__socials">
          <a href="https://github.com/aaronadams62" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
            <i className="fab fa-github" aria-hidden="true"></i>
          </a>
          <a href="https://linkedin.com/in/aaronadams62" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
            <i className="fab fa-linkedin" aria-hidden="true"></i>
          </a>
        </div>
      </div>
      <div className="footer__admin">
        <Link to="/admin" className="footer__admin-link">Admin Portal</Link>
      </div>
    </footer>
  );
}

export default Footer;