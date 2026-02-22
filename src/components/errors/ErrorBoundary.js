import React from 'react';
import './errors.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <div className="error-page__content">
            <span className="error-page__code">500</span>
            <h1 className="error-page__title">Something Went Wrong</h1>
            <p className="error-page__message">
              An unexpected error occurred. Please refresh the page or come back later.
            </p>
            <button className="error-page__btn" onClick={() => window.location.href = '/'}>
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
