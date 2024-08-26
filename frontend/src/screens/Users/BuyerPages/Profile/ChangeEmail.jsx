import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
const API_KEY = import.meta.env.VITE_API_KEY;

function ChangeEmail() {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const [filteredUser, setFilteredUser] = useState(null);

    // for navigation
    const navigate = useNavigate();
    const handleNavigation = (path) => {
        navigate(path);
    }

    async function fetchUserSession() {
        try {
            const response = await fetch("/api/session", {
                headers: {
                    "x-api-key": API_KEY,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUserId(data.user_id);
            } else {
                console.error("Failed to fetch user session:", response.statusText);
            }
        } catch (err) {
            console.error("Error fetching user session:", err.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/users", {
                headers: {
                    "x-api-key": API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchUserSession();
    }, []);

    useEffect(() => {
        if (userId && users.length > 0) {
            const user = users.find((user) => user.user_id === userId);
            setFilteredUser(user);
        }
    }, [userId, users]);

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div>Loading...</div>
                </div>
            ) : (
                <div className="change-email-container">
                    <h1 className="change-email-title">Change Email</h1>
                    <p className="change-email-subtitle">New Email</p>
                    <input
                        type='text'
                        name='newEmail'
                        className='change-email-input'
                        placeholder='Enter your new email here'
                    />
                    <button className='change-email-button' onClick={() => handleNavigation('/profile')}>Submit</button>
                </div>
            )}
        </>
    );
}

export default ChangeEmail;
