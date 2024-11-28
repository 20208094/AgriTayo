import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function EditAlternativeNumberPage() {
    const location = useLocation();
    const userId = location.state?.userId;
    const navigate = useNavigate();

    const [newSecondaryPhone, setNewSecondaryPhone] = useState("");
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
        if (newSecondaryPhone && !phone_regex.test(newSecondaryPhone)) {
            setPhoneError("Invalid phone number format. Please use 09 followed by 9 digits.");
        } else {
            setPhoneError("");
        }
    }, [newSecondaryPhone]);

    useEffect(() => {
        if (isClicked) {
            if (phoneNumbersList.includes(newSecondaryPhone) || phoneNumbers2List.includes(newSecondaryPhone)) {
                alert("Phone Number is already registered");
                setIsClicked(false);
            } else {
                const generateRandomCode = async () => {
                    const code = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedCode(code);
                    const title = "AgriTayo";
                    const message = `Your OTP code is: ${code}`;
                    const phone_number = newSecondaryPhone;

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
    }, [isClicked, newSecondaryPhone, phoneNumbersList, phoneNumbers2List]);

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
            formData.append("edit_secondary_phone_number", newSecondaryPhone);

            setLoading(true);
            try {
                const response = await fetch(`/api/editSecondaryPhoneNumber/${userId}`, {
                    method: "PUT",
                    headers: { "x-api-key": API_KEY },
                    body: formData,
                });
                if (response.ok) {
                    alert("Success! Alternative phone number updated.");
                    navigate('/admin/profile')
                } else {
                    alert("Failed to update alternative phone number.");
                }
            } catch (error) {
                alert("An error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleConfirm = () => {
        if (!newSecondaryPhone) {
            setPhoneError("Enter your new alternative phone number");
        } else if (!phone_regex.test(newSecondaryPhone)) {
            setPhoneError("Invalid alternative phone number format.");
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
            <p className=''>Loading</p>
        )
    }

    return (
        <div>
            <h1>Phone Number</h1>
            <input
                type="text"
                placeholder="09123456789"
                value={newSecondaryPhone}
                onChange={e => setNewSecondaryPhone(e.target.value)}
                disabled={isClicked}
            />
            {phoneError && <p>{phoneError}</p>}
            {!isClicked && (
                <button onClick={handleConfirm}>
                    Confirm
                </button>
            )}
            {isClicked && (
                <>
                    <p>Enter your 6-digit code:</p>
                    <input
                        type="text"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        placeholder="123456"
                    />
                    {otpError && <p>{otpError}</p>}
                    <button onClick={handleOtp}>Submit</button>
                    <p>- Didn’t receive the code?</p>
                    <button onClick={handleResend} disabled={!isResendEnabled}>
                        Resend
                    </button>
                    {seconds > 0 && <p>- OTP expires in {formatTime(seconds)}</p>}
                </>
            )}
        </div>
    );
}

export default EditAlternativeNumberPage;
