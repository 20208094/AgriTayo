import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneIcon, KeyIcon } from '@heroicons/react/24/outline';

const API_KEY = import.meta.env.VITE_API_KEY;

function ForgotPasswordPage() {
    const [phoneError, setPhoneError] = useState("");
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const phone_regex = /^(?:\+63|0)?9\d{9}$/;
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
        e.preventDefault();
        setPhoneError("");
        setLoading(true);

        try {
            if (isNaN(phone)) {
                setPhoneError("Please enter numbers only.");
            } else if (!phone) {
                setPhoneError("Enter your phone number");
            } else if (!phone_regex.test(phone)) {
                setPhoneError("Invalid phone number format. Please use 09 followed by 9 digits.");
            } else if (phoneNumbersList.includes(phone)) {
                alert("Phone Number Confirmed");
                navigate('/forgotPasswordOTP', { state: { phone } });
            } else {
                alert("Phone number not found. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)] flex items-center justify-center">
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
        <div className="fixed inset-0 bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-green-50 p-6 border-b border-green-100">
                        <div className="flex items-center justify-center space-x-3 mb-2">
                            <KeyIcon className="h-8 w-8 text-green-600" />
                            <h1 className="text-3xl font-bold text-green-700">
                                Reset Password
                            </h1>
                        </div>
                        <p className="text-center text-gray-600 mt-2">
                            Enter your phone number to reset your password
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Phone Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="09123456789"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg border 
                                            ${phoneError ? 'border-red-500 bg-red-50' : 'border-gray-300'} 
                                            focus:ring-2 focus:ring-green-500 focus:border-transparent 
                                            transition-all duration-200`}
                                    />
                                </div>
                                {phoneError && (
                                    <div className="flex items-center space-x-2 text-red-500">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm">{phoneError}</p>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold
                                    hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 
                                    focus:ring-green-500 focus:ring-offset-2 transform transition-all 
                                    duration-200 hover:scale-[1.02] disabled:opacity-50 
                                    disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                Reset Password
                            </button>

                            {/* Cancel Button */}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold
                                    hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-2 
                                    focus:ring-gray-500 focus:ring-offset-2 transform transition-all 
                                    duration-200 hover:scale-[1.02]"
                            >
                                Back to Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;