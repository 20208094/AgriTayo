import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function NewPasswordPage() {
    const location = useLocation();
    const phone = location.state?.phone;
    const navigate = useNavigate();

    console.log(phone)

    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [passwordError, setPasswordError] = useState("");
    const password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/;

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
                `/api/changePassword/${phone}`,
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
                alert("Successfully Updated Password");
                navigate("/login");
            } else {
                const errorData = await response.json();
                console.error("Updating new password failed:", errorData);
                alert("Updating the New Password Failed. Please Try Again");
            }
        } catch (error) {
            console.error("Error during updating the new password:", error);
            alert("An error occurred. Please try again.");
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
        </div>
    )
}

export default NewPasswordPage