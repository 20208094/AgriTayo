import React, { useEffect, useState } from "react";
import ProfileSidebar from "./ProfileComponents/ProfileSidebar";
import { useNavigate } from 'react-router-dom'

const API_KEY = import.meta.env.VITE_API_KEY;

function ChangePassword() {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const [filteredUser, setFilteredUser] = useState(null);

    // for navigation
    const navigate = useNavigate();
    const handleNavigation = (path) => {
        navigate(path)
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
                console.log("User session data:", data); // Logging user session data
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
            console.log("Fetched users:", data); // Logging users data
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
            console.log("Filtered user:", user); // Logging filtered user data
            setFilteredUser(user);
        }
    }, [userId, users]);

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div>Loading...</div>
                </div>
            ) :
                <div className="p-8 ml-72 mt-10">
                    <h1 className="">Change Password</h1>
                            <p className=''>Current Password</p>
                            <input
                            type='text'
                            name='currentPassword'
                            placeholder='Enter your current password here'
                            />
                            <p className=''>New Password</p>
                            <input
                            type='text'
                            name='newPassword'
                            placeholder='Enter your new password here'
                            />
                            <button className='' onClick={() => handleNavigation('/profile')}>Submit</button>
                </div>
            }
        </>
    );
}

export default ChangePassword;
