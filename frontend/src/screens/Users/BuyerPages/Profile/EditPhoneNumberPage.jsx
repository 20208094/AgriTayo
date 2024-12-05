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
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('success');

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
                setModalType('error');
                setModalMessage('Phone Number is already registered');
                setShowModal(true);
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
                        setModalType('success');
                        setModalMessage('Message sent successfully!');
                        setShowModal(true);
                    } catch (error) {
                        setModalType('error');
                        setModalMessage('Failed to send the message.');
                        setShowModal(true);
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
                    setModalType('success');
                    setModalMessage('Success! Phone number updated.');
                    setShowModal(true);
                    setTimeout(() => {
                        navigate('/admin/profile');
                    }, 1500);
                } else {
                    setModalType('error');
                    setModalMessage('Failed to update phone number.');
                    setShowModal(true);
                }
            } catch (error) {
                setModalType('error');
                setModalMessage('An error occurred. Please try again.');
                setShowModal(true);
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
            <div className="min-h-screen bg-gradient-to-br from-[rgb(182,244,146)] to-[rgb(51,139,147)] flex justify-center items-center">
                <div className="loading text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[rgb(182,244,146)] to-[rgb(51,139,147)] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-full backdrop-blur-lg bg-opacity-90">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Phone Number</h1>
                    <p className="text-gray-600 mb-6">Update your contact information</p>

                    {!isClicked ? (
                        <div className="space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter new phone number"
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                />
                                {phoneError && (
                                    <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                                )}
                            </div>
                            <button
                                onClick={handleConfirm}
                                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all transform hover:scale-[1.02] font-medium"
                            >
                                Confirm
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-gray-600 mb-4">
                                A 6-digit code has been sent to
                                <span className="font-semibold block">{newPhone}</span>
                            </p>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                />
                                {otpError && (
                                    <p className="text-red-500 text-sm mt-1">{otpError}</p>
                                )}
                            </div>

                            <button
                                onClick={handleOtp}
                                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all transform hover:scale-[1.02] font-medium"
                            >
                                Verify
                            </button>

                            <div className="text-center space-y-2">
                                <p className="text-gray-600">Didn't receive the code?</p>
                                <button
                                    onClick={handleResend}
                                    disabled={!isResendEnabled}
                                    className={`w-full py-2 rounded-lg transition-all ${
                                        isResendEnabled
                                            ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 transform hover:scale-[1.02]'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    Resend
                                </button>
                            </div>

                            {seconds > 0 && (
                                <p className="text-gray-600 text-sm text-center">
                                    Code expires in {formatTime(seconds)}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <div className="flex items-center justify-center mb-4">
                            {modalType === 'success' ? (
                                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                        <p className="text-center text-gray-700 mb-4">{modalMessage}</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditPhoneNumberPage;
