import React, { useEffect, useState } from "react";
import ProfileSidebar from "./ProfileComponents/ProfileSidebar";
import { useNavigate } from 'react-router-dom';


function ChangePassword() {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const [filteredUser, setFilteredUser] = useState(null);

    const navigate = useNavigate();
    const handleNavigation = (path) => {
        navigate(path);
    };

    useEffect(() => {
        async function fetchUserSession() {
            try {
                const response = await fetch("/api/session", {
                    headers: {
                        "x-api-key": import.meta.env.VITE_API_KEY,
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

        async function fetchUsers() {
            try {
                const response = await fetch("/api/users", {
                    headers: {
                        "x-api-key": import.meta.env.VITE_API_KEY,
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
        }

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
                <div className="change-password-container">
                    <h1 className="change-password-title">Change Password</h1>
                    <label className="change-password-label">Current Password</label>
                    <input
                        className="change-password-input"
                        type="password"
                        name="currentPassword"
                        placeholder="Enter your current password here"
                    />
                    <label className="change-password-label">New Password</label>
                    <input
                        className="change-password-input"
                        type="password"
                        name="newPassword"
                        placeholder="Enter your new password here"
                    />
                    <button className="change-password-button" onClick={() => handleNavigation('/profile')}>
                        Submit
                    </button>
                </div>
            )}
        </>
    );
}

export default ChangePassword;
