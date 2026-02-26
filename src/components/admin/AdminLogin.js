import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';
import { resetAdminPassword, signInAdmin } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

function AdminLogin() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const { authEnabled } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await signInAdmin({ identifier, password });
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setError('');
        setSuccess('');
        setResetLoading(true);
        try {
            await resetAdminPassword({ identifier });
            setSuccess('Password reset email sent. Check your inbox.');
        } catch (err) {
            setError(err.message || 'Unable to send password reset email.');
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-login-card">
                <h2>Admin Portal</h2>
                {!authEnabled && (
                    <p className="error-message">Firebase Auth is not configured for this environment.</p>
                )}
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    <button type="submit" className="admin-btn" disabled={loading}>
                        {loading ? 'Signing In...' : 'Login'}
                    </button>
                </form>
                <button
                    type="button"
                    className="admin-link-btn"
                    onClick={handleResetPassword}
                    disabled={resetLoading || loading}
                >
                    {resetLoading ? 'Sending reset email...' : 'Forgot password? Reset'}
                </button>
                <button
                    type="button"
                    className="admin-link-btn"
                    onClick={() => navigate('/')}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default AdminLogin;
