import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function ForgotPasswordPage() {
    const [phoneError, setPhoneError] = useState("");
    const navigate = useNavigate();
    const [phone, setPhone] = useState('')

    const phone_regex = /^(?:\+63|0)?9\d{9}$/

    const [phoneNumbersList, setPhoneNumbersList] = useState([]);

    useEffect(() => {
        const fetchPhoneNumbers = async () => {
            try {
                const response = await fetch(`/api/users`, {
                    headers: { "x-api-key": API_KEY },
                });
                if (response.ok) {
                    const data = await response.json();
                    const numbers = data.map((user) => user.phone_number);
                    setPhoneNumbersList(numbers);
                } else {
                    console.error("Failed to fetch phone numbers");
                }
            } catch (error) {
                console.error("Error fetching phone numbers:", error);
            }
        };

        fetchPhoneNumbers();
    }, []);

    const handleSubmit = async (e) => {
        setPhoneError("")
        e.preventDefault();

        if (isNaN(phone)) {
            setPhoneError("Please enter numbers only.")
            return;
        } else if (!phone) {
            setPhoneError("Enter your phone Number")
            return;
        } else if (!phone_regex.test(phone)) {
            setPhoneError("Invalid phone number format. Please use 09 followed by 9 digits.");
        } else if (
            (phoneNumbersList.includes(phone))
        ) {
            alert("Phone Number Confirmed");
            navigate('/forgotPasswordOTP', { state: { phone } })
        } else {
            alert("Phone number not found. Please try again.")
        }
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
            <div className='bg-white shadow-md rounded-lg p-6 max-w-md w-full'>
                <h1 className='text-2xl font-bold text-center text-green-600 mb-4'>Reset Password</h1>
            
            <div className='mb-4'>
                <input
                    type="text"
                    placeholder='09123456789'
                    name="phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                />
                {phoneError && <p className='text-red-500 text-sm mt-1'>{phoneError}</p>}
            </div>
            <div className='mb-4'>
                <button onClick={handleSubmit} className='w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors'>
                    Submit
                </button>
            </div>
            </div>
        </div>
    )
}

export default ForgotPasswordPage