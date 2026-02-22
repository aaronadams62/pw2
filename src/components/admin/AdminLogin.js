import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            localStorage.setItem('adminToken', data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-login-card">
                <h2>Admin Portal</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="admin-btn">Login</button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
