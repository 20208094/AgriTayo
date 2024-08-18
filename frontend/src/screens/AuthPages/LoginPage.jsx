import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Function to fetch the user session
    const fetchUserSession = async () => {
        try {
            const response = await fetch('/api/session');
            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    // Redirect based on user type
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
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error);
                return;
            }
            const data = await response.json();
    
            // Store the token in localStorage
            localStorage.setItem('token', data.token);
    
            // Redirect based on user type
            if (data.user.user_type_id === 1) {
                navigate('/admin/dashboard');
            } else if (data.user.user_type_id === 2) {
                navigate('/seller/dashboard');
            } else {
                navigate('/buyer/dashboard');
            }
    
            // Refresh the page
            window.location.reload();  // <-- This will refresh the page
        } catch (error) {
            console.error('Error during login:', error);
            setError('An error occurred. Please try again.');
        }
    };
    
    if (loading) {
        return <p>Loading...</p>; // Optional: Add a loading state or spinner
    }

    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: 'auto' }}>
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
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
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
