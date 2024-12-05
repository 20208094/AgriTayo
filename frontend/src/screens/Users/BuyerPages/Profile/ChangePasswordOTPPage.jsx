import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function ChangePasswordOTPPage() {
    const location = useLocation();
    const userId = location.state?.userId;
    const filteredUser = location.state?.filteredUser;
    const navigate = useNavigate();

    console.log(filteredUser)

    const [generatedCode, setGeneratedCode] = useState("");
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const [otpError, setOtpError] = useState("");

    const [seconds, setSeconds] = useState(10 * 60);

    const [phoneNumber, setPhoneNumber] = useState('')

    const generateRandomCode = async () => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code); // Store generated code in state
        const title = "AgriTayo";
        const message = `Your OTP code is: ${code}`;
        const phone_number = filteredUser.phone_number;

        try {
            const response = await fetch('/api/sms_sender', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                body: JSON.stringify({
                    title,
                    message,
                    phone_number,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('SMS sent successfully:', data);
            alert('Message sent successfully!');

        } catch (error) {
            console.error('Error sending SMS:', error);
            alert('Failed to send the message.');
        }
    };

    useEffect(() => {
        generateRandomCode(); // Generate code on component mount
    }, [filteredUser.phone_number]);

    console.log(generatedCode)

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

    const handleOtp = async (e) => {
        setOtpError("")
        e.preventDefault();

        if (isNaN(phoneNumber)) {
            setOtpError("Please enter numbers only.");
        } else if (phoneNumber.length < 6) {
            setOtpError("Enter the 6 digit code");
        } else if (phoneNumber !== generatedCode) {
            setOtpError("Invalid OTP. Please try again.");
        } else {
            navigate('/admin/changePassword', { state: { userId } })
        }
    }

    const handleResend = () => {
        setSeconds(10 * 60);
        setIsResendEnabled(false);
        generateRandomCode();
    };

    return (
        <div className="otp-container">
            <div className="otp-card">
                <div className="otp-content">
                    <h1 className="otp-header">Verify Your Phone Number</h1>
                    
                    <p className="otp-instructions">
                        A 6-digit code has been sent to 
                        <span className="phone-number">{filteredUser.phone_number}</span>
                    </p>
                    
                    <div className="input-container">
                        <input 
                            className="otp-input"
                            type="text"
                            placeholder="Enter 6-digit code"
                            maxLength="6"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        {otpError && <p className="otp-error">{otpError}</p>}
                    </div>

                    <div className="resend-container">
                        <p className="resend-text">Didn't receive the code?</p>
                        <button
                            onClick={isResendEnabled ? handleResend : null}
                            disabled={!isResendEnabled}
                            className="resend-button"
                        >
                            Resend
                        </button>
                    </div>

                    {seconds > 0 && (
                        <p className="timer">Code expires in {formatTime(seconds)}</p>
                    )}

                    <button
                        className="verify-button"
                        onClick={handleOtp}
                    >
                        Verify
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordOTPPage;