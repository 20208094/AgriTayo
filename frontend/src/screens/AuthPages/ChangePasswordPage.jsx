import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function ChangePassword() {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const [filteredUser, setFilteredUser] = useState(null);

    const navigate = useNavigate();
    const handleNavigation = (path) => navigate(path);

    async function fetchUserSession() {
        try {
            const response = await fetch("/api/session", {
                headers: { "x-api-key": API_KEY },
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
                headers: { "x-api-key": API_KEY },
            });
            if (!response.ok) throw new Error("Network response was not ok");
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
                <div className="loading-container">
                    <div className="loading-text">Loading...</div>
                </div>
            ) : (
                <div className="change-password-container">
                    <h1 className="change-password-title">Change Password</h1>
                    {filteredUser ? (
                        <>
                            <p className="change-password-subtitle">
                                A 6-digit code has been sent to <span className="highlighted-text">{filteredUser.email}</span>
                            </p>
                            <button
                                onClick={() => handleNavigation('/changeEmail')}
                                className="change-button"
                            >
                                Change Email
                            </button>
                            <input
                                type="text"
                                name="code"
                                placeholder="Enter the OTP"
                                className="change-password-input"
                            />
                            <p className="otp-timer">OTP expires in {formatTime(seconds)}</p>
                            <p className="otp-info">Didn’t receive the code?</p>
                            <button
                                onClick={handleResend}
                                className="resend-button"
                                disabled={!isResendEnabled}
                            >
                                Resend Code
                            </button>
                            <button
                                onClick={() => handleNavigation('/changePassword')}
                                className="verify-button"
                            >
                                Verify
                            </button>
                        </>
                    ) : (
                        <p className="no-user-data">No user data found</p>
                    )}
                </div>
            )}
        </>
    );
}

export default ChangePassword;
