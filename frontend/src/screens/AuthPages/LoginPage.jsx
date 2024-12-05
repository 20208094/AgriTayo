import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const API_KEY = import.meta.env.VITE_API_KEY;

function LoginPage() {
    const [formData, setFormData] = useState({
        phone_number: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const fetchUserSession = async () => {
        try {
            const response = await fetch('/api/session', {
                headers: {
                    'x-api-key': API_KEY
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    if (data.user.user_type_id === '1') {
                        navigate('/dashboard-admin');
                    } else if (data.user.user_type_id === '2') {
                        navigate('/dashboard-seller');
                    } else {
                        navigate('/dashboard-buyer');
                    }
                }
            } else {
                console.error('Failed to fetch user session:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user session:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserSession();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(''); // Clear error when user starts typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify({
                    phone_number: formData.phone_number, // sending phone_number in place of email
                    password: formData.password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Invalid phone number or password.');
                return;
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);

            // Navigate based on user type
            if (data.user.user_type_id === 1) {
                navigate('/admin/dashboard');
            } else if (data.user.user_type_id === 2) {
                navigate('/seller/dashboard');
            } else {
                navigate('/buyer/dashboard');
            }
            window.location.reload();

        } catch (error) {
            console.error('Error during login:', error);
            setError('An error occurred. Please try again.');
        }
    };
    
    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen md:fixed md:inset-0 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
            {/* Left Side - Logo */}
            <div className="w-full md:w-1/2 bg-[#fddaa6] flex items-center justify-center min-h-[40vh] md:min-h-screen py-8">
                <div className="w-full max-w-2xl flex items-center justify-center p-8"> {/* Increased max-w-xl to max-w-2xl */}
                    <img 
                        src="/AgriTayo_Logo_wName.png" 
                        alt="AgriTayo Logo" 
                        className="w-full h-auto scale-125 transform transition-transform duration-300 hover:scale-[1.3]" /* Added scale-125 for bigger base size and adjusted hover scale */
                    />
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-[#b6f492] to-[#338b93] flex items-center justify-center p-4 md:p-8 min-h-screen">
                <div className="w-full max-w-md space-y-6 bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl my-8 md:my-0">
                    <div>
                        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-center text-gray-600">
                            Please sign in to continue
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Phone Number Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaPhoneAlt className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                                        focus:ring-2 focus:ring-green-500 focus:border-transparent
                                        transition-all duration-200"
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg 
                                        focus:ring-2 focus:ring-green-500 focus:border-transparent
                                        transition-all duration-200"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <FaEye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium
                                    hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 
                                    focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02]"
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/register')}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium
                                    hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 
                                    focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02]"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>

                    {/* Forgot Password Link */}
                    <div className="text-center">
                        <button
                            onClick={() => navigate('/forgotPassword')}
                            className="text-green-600 hover:text-green-700 font-medium 
                                transition-colors duration-200"
                        >
                            Forgot your password?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
