import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ClockIcon, PhoneIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const API_KEY = import.meta.env.VITE_API_KEY;

function ChangePasswordOTPPage() {
    const location = useLocation();
    const userId = location.state?.userId;
    const filteredUser = location.state?.filteredUser;
    const navigate = useNavigate();

    const [generatedCode, setGeneratedCode] = useState("");
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [loading, setLoading] = useState(false);
    const [seconds, setSeconds] = useState(10 * 60);
    const [phoneNumber, setPhoneNumber] = useState('');

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

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(to right, rgb(182, 244, 146), rgb(51, 139, 147))' }}>
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl flex items-center space-x-4">
                    <div className="animate-spin h-8 w-8 text-green-600">
                        <svg className="w-full h-full" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    </div>
                    <span className="text-lg font-semibold text-gray-700">Verifying...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0" style={{ background: 'linear-gradient(to right, rgb(182, 244, 146), rgb(51, 139, 147))' }}>
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-green-50 p-6 border-b border-green-100">
                        <div className="flex items-center justify-center space-x-3 mb-2">
                            <ShieldCheckIcon className="h-8 w-8 text-green-600" />
                            <h1 className="text-3xl font-bold text-green-700">
                                Verify Your Number
                            </h1>
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-gray-600">
                                A 6-digit code has been sent to
                            </p>
                            <p className="font-semibold text-gray-800 mt-1">
                                {filteredUser.phone_number}
                            </p>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* OTP Input */}
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="● ● ● ● ● ●"
                                maxLength="6"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className={`w-full px-4 py-3 text-center text-2xl tracking-[1em] rounded-lg border 
                                    ${otpError ? 'border-red-500 bg-red-50' : 'border-gray-300'} 
                                    focus:ring-2 focus:ring-green-500 focus:border-transparent 
                                    transition-all duration-200 font-mono placeholder:tracking-[0.75em]`}
                            />
                            
                            {otpError && (
                                <div className="flex items-center justify-center space-x-2 text-red-500">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm">{otpError}</p>
                                </div>
                            )}
                        </div>

                        {/* Timer and Resend */}
                        <div className="flex flex-col items-center space-y-3">
                            <div className="flex items-center space-x-2">
                                <ClockIcon className="h-5 w-5 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                    {seconds > 0 ? `Code expires in ${formatTime(seconds)}` : 'Code expired'}
                                </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Didn't receive the code?</span>
                                <button
                                    onClick={isResendEnabled ? handleResend : null}
                                    disabled={!isResendEnabled}
                                    className={`text-sm font-semibold px-3 py-1 rounded-lg
                                        ${isResendEnabled 
                                            ? 'text-green-600 hover:bg-green-50 active:bg-green-100' 
                                            : 'text-gray-400'
                                        } transition-all duration-200`}
                                >
                                    Resend Code
                                </button>
                            </div>
                        </div>

                        {/* Verify Button */}
                        <button
                            onClick={handleOtp}
                            className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold
                                hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 
                                focus:ring-green-500 focus:ring-offset-2 transform transition-all 
                                duration-200 hover:scale-[1.02] disabled:opacity-50 
                                disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            Verify Number
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordOTPPage;