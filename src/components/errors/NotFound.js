import React from 'react';
import { Link } from 'react-router-dom';
import './errors.css';

function NotFound() {
  return (
    <div className="error-page">
      <div className="error-page__content">
        <span className="error-page__code">404</span>
        <h1 className="error-page__title">Page Not Found</h1>
        <p className="error-page__message">
          Looks like this page doesn't exist. Maybe it moved, or maybe it never existed.
        </p>
        <Link to="/" className="error-page__btn">Back to Home</Link>
      </div>
    </div>
  );
}

export default NotFound;
