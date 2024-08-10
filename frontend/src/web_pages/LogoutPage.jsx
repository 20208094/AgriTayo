import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                // Clear local storage or session storage if needed
                localStorage.removeItem('user');
                navigate('/login'); // Redirect to login page or home page
            } else {
                console.error('Logout failed:', await response.json());
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }

        window.location.reload();  // <-- This will refresh the page
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}

export default LogoutButton;
