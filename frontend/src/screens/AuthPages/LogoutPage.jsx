import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function LogoutButton() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const response = await fetch('/api/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY // Include the API key in the request headers
                    }
                });
                if (response.ok) {
                    localStorage.removeItem('user');
                    navigate('/login');
                } else {
                    console.error('Logout failed:', await response.json());
                }
            } catch (error) {
                console.error('Error during logout:', error);
            }
            window.location.reload();
        };

        handleLogout();
    }, [navigate]);

    return (
        <div>
            <p>Logging out...</p>
        </div>
    );
}

export default LogoutButton;
