import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function OTPPage() {
    const location = useLocation();
    const formData = location.state?.formData;
    const navigate = useNavigate();

    console.log(formData)

    const [generatedCode, setGeneratedCode] = useState("");
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [loading, setLoading] = useState(false);

    const [seconds, setSeconds] = useState(10 * 60);

    const [phoneNumber, setPhoneNumber] = useState('')

    const generateRandomCode = async() => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code); // Store generated code in state
        const title = "AgriTayo";
        const message = `Your OTP code is: ${code}`;
        const phone_number = formData.phone_number;

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
    }, [formData.phone_number]);

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
            setLoading(true);
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY // Include the API key in the request headers
                    },
                    body: JSON.stringify(formData)
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    alert(errorData.error + ": " + errorData.details);
                    return;
                }
                alert('Registered Successfully!')
                // Redirect to login page after successful registration
                navigate('/login'); // Adjust the path as needed
            } catch (error) {
                console.error('Error during registration:', error);
                alert('An error occurred. Please try again.');
            } finally {
                setLoading(false)
            }
        }
    }

    const handleResend = () => {
        setSeconds(10 * 60);
        setIsResendEnabled(false);
        generateRandomCode();
    };

    if (loading) {
        return(
            <p className=''>Loading</p>
        )
    }

    return (
        <>
            <div className=''>
                <div className=''>
                    <h1 className=''>Verify Your Phone Number</h1>
                </div>
                <div className=''>
                    <p className=''> A 6-digit code has been sent to {formData.phone_number}</p>
                </div>
                <div className=''>
                    <input className=''
                        type='text'
                        placeholder='123456'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                {otpError ? (
                    <p>{otpError}</p>
                ) : null}
                <div className=''>
                    <p className=''>- Didn’t receive the code?</p>
                    <button
                        onClick={isResendEnabled ? handleResend : null}
                        disabled={isResendEnabled}
                        className={`text-${isResendEnabled ? "green-500" : "gray-400"} ${isResendEnabled ? "cursor-pointer" : "cursor-not-allowed"
                            }`}
                    >
                        Resend
                    </button>
                </div>

                {seconds > 0 && (
                    <p className=''>- The OTP will expire in {formatTime(seconds)}</p>
                )}

                <button
                className=''
                onClick={handleOtp}
                >
                    Verify
                </button>

            </div>
        </>
    )
}
export default OTPPage;