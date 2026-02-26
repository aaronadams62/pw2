import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p>&copy; {new Date().getFullYear()} AaronAdams.dev. All rights reserved.</p>
        <div className="footer__socials">
          <a href="https://github.com/aaronadams62" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
            <FontAwesomeIcon icon={['fab', 'github']} />
          </a>
          <a href="https://linkedin.com/in/aaronadams62" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
            <FontAwesomeIcon icon={['fab', 'linkedin']} />
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