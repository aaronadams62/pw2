import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';
import { adminEmails } from '../../firebase';
import { signInAdmin } from '../../services/authService';

function AdminLogin() {
    const [email, setEmail] = useState(adminEmails[0] || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInAdmin({ email, password });
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid email or password');
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
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
            </div>
        </div>
    );
}

export default AdminLogin;
