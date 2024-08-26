import React, { useEffect, useState } from "react";
import ProfileSidebar from "../Users/BuyerPages/Profile/ProfileComponents/ProfileSidebar";
import { useNavigate } from 'react-router-dom'

const API_KEY = import.meta.env.VITE_API_KEY;

function Authentication() {
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

    //   for timer and resend
    const [seconds, setSeconds] = useState(10 * 60);
    const [isResendEnabled, setIsResendEnabled] = useState(false);

    useEffect(() => {
        let interval = null;
        if (seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);
        } else {
            setIsResendEnabled(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [seconds]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
            2,
            "0"
        )}`;
    };

    const handleResend = () => {
        setSeconds(10 * 60);
        setIsResendEnabled(false);
    };

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div>Loading...</div>
                </div>
            ) : (
                <div className="p-8 ml-72 mt-10">
                    <h1 className="">Change Password</h1>
                    {filteredUser ? (
                        <>
                            <p className=''>A 6-digit code has been sent to {filteredUser.email}</p>
                            <button onClick={() => handleNavigation('/changeEmail')}>
                                Change
                            </button>
                            <input
                                type='text'
                                name='code'
                                placeholder='123456'
                                className=''
                            />
                            <p className=''>-The OTP will expire in {formatTime(seconds)}</p>
                            <p className=''>Didn’t recieve the code? </p>
                            <button onClick={handleResend} className=''>Resend</button>
                            <button onClick={() => handleNavigation('/changePassword')} className=''>
                                Verify
                            </button>
                        </>
                    ) : (
                        <p>No user data found</p>
                    )}
                </div>
            )}
        </>
    );
}

export default Authentication;
