import React, { useEffect, useState } from "react";
import ProfileSidebar from "../Users/BuyerPages/Profile/ProfileComponents/ProfileSidebar";
import { useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function Authentication() {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const [filteredUser, setFilteredUser] = useState(null);

    const navigate = useNavigate();
    const handleNavigation = (path) => {
        navigate(path);
    };

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
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    const handleResend = () => {
        setSeconds(10 * 60);
        setIsResendEnabled(false);
    };

    return (
        <>
            {loading ? (
                <div className="auth-loading-container">
                    <div className="auth-loading-text">Loading...</div>
                </div>
            ) : (
                <div className="auth-content-container">
                    <h1 className="auth-title">Change Password</h1>
                    {filteredUser ? (
                        <>
                            <p className="auth-subtitle">A 6-digit code has been sent to {filteredUser.email}</p>
                            <button onClick={() => handleNavigation('/changeEmail')} className="auth-change-button">
                                Change
                            </button>
                            <input
                                type="text"
                                name="code"
                                placeholder="123456"
                                className="auth-input"
                            />
                            <p className="auth-otp-timer">- The OTP will expire in {formatTime(seconds)}</p>
                            <p className="auth-otp-info">Didn’t receive the code?</p>
                            <button onClick={handleResend} className="auth-resend-button" disabled={!isResendEnabled}>
                                Resend
                            </button>
                            <button onClick={() => handleNavigation('/changePassword')} className="auth-submit-button">
                                Verify
                            </button>
                        </>
                    ) : (
                        <p className="auth-no-data">No user data found</p>
                    )}
                </div>
            )}
        </>
    );
}

export default Authentication;
