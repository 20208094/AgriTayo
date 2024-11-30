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
                alert("Successfully Updated Password");
                navigate("/admin/profile");
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
        <div className=''>
            <div className=''>
                <h1 className=''>Enter your new password</h1>
            </div>
            <div className=''>
                <input
                    type="password"
                    name="password"
                    placeholder='*********'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className=""
                />
                {passwordError && <p className=''>{passwordError}</p>}
            </div>
            <div className=''>
                <button onClick={handleSubmit} className=''>
                    Submit
                </button>
            </div>
        </div>
    )
}

export default ChangePasswordPage