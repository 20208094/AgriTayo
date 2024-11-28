import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function EditPhoneNumberPage() {
    const location = useLocation();
    const userId = location.state?.userId;
    const navigate = useNavigate();

    const [newPhone, setNewPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const [seconds, setSeconds] = useState(10 * 60);
    const [isResendEnabled, setIsResendEnabled] = useState(false);

    const phone_regex = /^(?:\+63|0)9\d{2}[-\s]?\d{3}[-\s]?\d{4}$/;

    const [phoneNumbersList, setPhoneNumbersList] = useState([]);
    const [phoneNumbers2List, setPhoneNumbers2List] = useState([]);

    useEffect(() => {
        if (newPhone && !phone_regex.test(newPhone)) {
            setPhoneError("Invalid phone number format. Please use 09 followed by 9 digits.");
        } else {
            setPhoneError("");
        }
    }, [newPhone]);

    useEffect(() => {
        if (isClicked) {
            if (phoneNumbersList.includes(newPhone) || phoneNumbers2List.includes(newPhone)) {
                alert("Phone Number is already registered");
                setIsClicked(false);
            } else {
                const generateRandomCode = async () => {
                    const code = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedCode(code);
                    const title = "AgriTayo";
                    const message = `Your OTP code is: ${code}`;
                    const phone_number = newPhone;

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

                        if (!response.ok) throw new Error('Network response was not ok');

                        const data = await response.json();
                        console.log('SMS sent successfully:', data);
                        alert('Message sent successfully!');
                    } catch (error) {
                        alert('Failed to send the message.');
                    }
                };

                generateRandomCode();
                setSeconds(10 * 60);
            }
        }
    }, [isClicked, newPhone, phoneNumbersList, phoneNumbers2List]);

    useEffect(() => {
        const fetchPhoneNumbers = async () => {
            try {
                const response = await fetch(`/api/users`, {
                    headers: { "x-api-key": API_KEY },
                });
                if (response.ok) {
                    const data = await response.json();
                    setPhoneNumbersList(data.map(user => user.phone_number));
                    setPhoneNumbers2List(data.map(user => user.secondary_phone_number));
                }
            } catch (error) {
                console.error("Error fetching phone numbers:", error);
            }
        };

        fetchPhoneNumbers();
    }, []);

    useEffect(() => {
        if (seconds > 0) {
            const interval = setInterval(() => setSeconds(prev => prev - 1), 1000);
            return () => clearInterval(interval);
        } else {
            setIsResendEnabled(true);
        }
    }, [seconds]);

    const formatTime = seconds => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    const handleOtp = async e => {
        e.preventDefault();
        if (isNaN(otp)) {
            setOtpError("Please enter numbers only.");
        } else if (otp.length < 6) {
            setOtpError("Enter the 6-digit code.");
        } else if (otp !== generatedCode) {
            setOtpError("Invalid OTP. Please try again.");
        } else {
            const formData = new FormData();
            formData.append("edit_phone_number", newPhone);

            setLoading(true);
            try {
                const response = await fetch(`/api/editPhoneNumber/${userId}`, {
                    method: "PUT",
                    headers: { "x-api-key": API_KEY },
                    body: formData,
                });
                if (response.ok) {
                    alert("Success! Phone number updated.");
                    navigate('/admin/profile')
                } else {
                    alert("Failed to update phone number.");
                }
            } catch (error) {
                alert("An error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleConfirm = () => {
        if (!newPhone) {
            setPhoneError("Enter your new phone number");
        } else if (!phone_regex.test(newPhone)) {
            setPhoneError("Invalid phone number format.");
        } else {
            setIsClicked(true);
        }
    };

    const handleResend = () => {
        setSeconds(10 * 60);
        setIsResendEnabled(false);
        setIsClicked(true);
    };

    console.log(generatedCode)

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg text-green-600">Loading...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center text-green-600 mb-4">Edit Phone Number</h1>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="09123456789"
                        value={newPhone}
                        onChange={e => setNewPhone(e.target.value)}
                        disabled={isClicked}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                    />
                    {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                </div>
                {!isClicked && (
                    <button
                        onClick={handleConfirm}
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Confirm
                    </button>
                )}
                {isClicked && (
                    <>
                        <p className="text-center mt-4">Enter your 6-digit code:</p>
                        <div className="mb-4">
                            <input
                                type="text"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                placeholder="123456"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                            />
                            {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}
                        </div>
                        <button
                            onClick={handleOtp}
                            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Submit
                        </button>
                        <p className="text-center mt-4">- Didn’t receive the code?</p>
                        <button
                            onClick={handleResend}
                            disabled={!isResendEnabled}
                            className={`w-full py-2 mt-2 rounded-lg ${isResendEnabled ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            Resend
                        </button>
                        {seconds > 0 && <p className="text-center mt-2 text-sm text-gray-600">- OTP expires in {formatTime(seconds)}</p>}
                    </>
                )}
            </div>
        </div>
    );
}

export default EditPhoneNumberPage;
