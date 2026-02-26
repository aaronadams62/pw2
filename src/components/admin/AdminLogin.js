import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';
import { isFirebaseAuthEnabled, signInAdmin } from '../../services/authService';

function AdminLogin() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const firebaseAuthEnabled = isFirebaseAuthEnabled();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
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

    return (
        <div className="admin-container">
            <div className="admin-login-card">
                <h2>Admin Portal</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>{firebaseAuthEnabled ? 'Email' : 'Username or Email'}</label>
                        <input
                            type={firebaseAuthEnabled ? 'email' : 'text'}
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                            autoComplete={firebaseAuthEnabled ? 'username' : 'on'}
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
            </div>
        </div>
    );
}

export default AdminLogin;
