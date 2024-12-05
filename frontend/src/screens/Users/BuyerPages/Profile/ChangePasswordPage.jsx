import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { KeyIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const API_KEY = import.meta.env.VITE_API_KEY;

function ChangePasswordPage() {
    const location = useLocation();
    const userId = location.state?.userId;
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/;
    const [showPassword, setShowPassword] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('success');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPasswordError("");

        if (!newPassword) {
            setPasswordError("Enter your password");
            return;
        } else if (!password_regex.test(newPassword)) {
            setPasswordError(
                "Invalid Password. Please enter 8-30 characters, including letters and numbers"
            );
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("pass", newPassword);

            const response = await fetch(
                `/api/editPassword/${userId}`,
                {
                    method: "PUT",
                    headers: {
                        "x-api-key": API_KEY,
                    },
                    body: formData,
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Successfully Updated Password", data);
                setModalType('success');
                setModalMessage('Successfully Updated Password');
                setShowModal(true);
                setTimeout(() => {
                    navigate("/admin/profile");
                }, 1500);
            } else {
                const errorData = await response.json();
                console.error("Updating new password failed:", errorData);
                setModalType('error');
                setModalMessage('Updating the New Password Failed. Please Try Again');
                setShowModal(true);
            }
        } catch (error) {
            console.error("Error during updating the new password:", error);
            setModalType('error');
            setModalMessage('An error occurred. Please try again.');
            setShowModal(true);
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
                    <span className="text-lg font-semibold text-gray-700">Updating Password...</span>
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
                                Change Password
                            </h1>
                        </div>
                        <p className="text-center text-gray-600 mt-2">
                            Enter your new password below
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Password Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className={`w-full pl-10 pr-12 py-3 rounded-lg border 
                                            ${passwordError ? 'border-red-500 bg-red-50' : 'border-gray-300'} 
                                            focus:ring-2 focus:ring-green-500 focus:border-transparent 
                                            transition-all duration-200`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {passwordError && (
                                    <div className="flex items-center space-x-2 text-red-500">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm">{passwordError}</p>
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
                                Update Password
                            </button>

                            {/* Cancel Button */}
                            <button
                                type="button"
                                onClick={() => navigate('/admin/profile')}
                                className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold
                                    hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-2 
                                    focus:ring-gray-500 focus:ring-offset-2 transform transition-all 
                                    duration-200 hover:scale-[1.02]"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
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

export default ChangePasswordPage;