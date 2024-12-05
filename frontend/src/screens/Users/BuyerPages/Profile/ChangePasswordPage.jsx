import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function ChangePasswordPage() {
    const location = useLocation();
    const userId = location.state?.userId;
    const navigate = useNavigate();

    console.log(userId)

    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [passwordError, setPasswordError] = useState("");
    const password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/;

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

        const formData = new FormData();
        formData.append("pass", newPassword);

        setLoading(true);
        try {
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
            <div className="loading">Loading...</div>
        )
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
            <div className='bg-white shadow-md rounded-lg p-6 max-w-md w-full'>
                <h1 className='text-2xl font-bold text-center text-green-600 mb-4'>Enter your new password</h1>
            
            <div className='mb-4'>
                <input
                    type="password"
                    name="password"
                    placeholder='*********'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                />
                {passwordError && <p className='text-red-500 text-sm mt-1'>{passwordError}</p>}
            </div>
            <div className='mb-4'>
                <button onClick={handleSubmit} className='w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors'>
                    Submit
                </button>
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
    )
}

export default ChangePasswordPage