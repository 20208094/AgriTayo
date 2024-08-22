import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const API_KEY = import.meta.env.VITE_API_KEY;

function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUserSession = async () => {
        try {
            const response = await fetch('/api/session', {
                headers: {
                    'x-api-key': API_KEY
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    if (data.user.user_type_id === '1') {
                        navigate('/dashboard-admin');
                    } else if (data.user.user_type_id === '2') {
                        navigate('/dashboard-seller');
                    } else {
                        navigate('/dashboard-buyer');
                    }
                }
            } else {
                console.error('Failed to fetch user session:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user session:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserSession();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error);
                return;
            }
            const data = await response.json();
            localStorage.setItem('token', data.token);
            if (data.user.user_type_id === 1) {
                navigate('/admin/dashboard');
            } else if (data.user.user_type_id === 2) {
                navigate('/seller/dashboard');
            } else {
                navigate('/buyer/dashboard');
            }
            window.location.reload();
        } catch (error) {
            console.error('Error during login:', error);
            setError('An error occurred. Please try again.');
        }
    };
    
    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="login-page-container">
            <div className="left-side">
                <img src="/AgriTayo_Logo_wName.png" alt="AgriTayo Logo" className="login-image" />
            </div>
            <div className="right-side">
                <h1 className="login-heading">Login</h1>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            className="login-input"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            className="login-input"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                    <button className="register-button1" onClick={() => navigate('/register')}>Register</button>
                </form>
                <p className="forgot-password" onClick={() => navigate('/forgot-password')}>Forgot Password? Click Here</p>
            </div>
        </div>
    );
}

export default LoginPage;
