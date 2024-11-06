import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function RegisterPage() {
    const [formData, setFormData] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        birthday: '',
        gender: '',
        phone_number: '',
        secondary_phone_number: '',
        password: '',
        confirm_password: '',
        user_type_id: 1, // Default user type ID
        verified: false
    });
    
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const navigate = useNavigate();

    // Regular expressions for validation
    const regex = {
        firstname: /^[A-Za-z\s]{2,}$/,
        middlename: /^[A-Za-z\s]{2,}$/,
        lastname: /^[A-Za-z\s]{2,}$/,
        password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/,
        phone: /^(?:\+63|0)?9\d{9}$/
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Real-time validation
        if (name === 'firstname' && !regex.firstname.test(value)) {
            setErrors((prev) => ({ ...prev, firstname: "Invalid First Name. Please enter at least 2 letters." }));
        } else if (name === 'middlename' && value && !regex.middlename.test(value)) {
            setErrors((prev) => ({ ...prev, middlename: "Invalid Middle Name. Please enter at least 2 letters." }));
        } else if (name === 'lastname' && !regex.lastname.test(value)) {
            setErrors((prev) => ({ ...prev, lastname: "Invalid Last Name. Please enter at least 2 letters." }));
        } else if (name === 'phone_number' && !regex.phone.test(value)) {
            setErrors((prev) => ({ ...prev, phone_number: "Invalid phone number. Format should start with 09 and have 11 digits." }));
        } else if (name === 'secondary_phone_number' && value && !regex.phone.test(value)) {
            setErrors((prev) => ({ ...prev, secondary_phone_number: "Invalid alternative phone number format." }));
        } else if (name === 'password' && !regex.password.test(value)) {
            setErrors((prev) => ({ ...prev, password: "Password must contain 8-30 characters, including letters and numbers." }));
        } else if (name === 'confirm_password' && value !== formData.password) {
            setErrors((prev) => ({ ...prev, confirm_password: "Passwords do not match." }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check required fields and set errors if any
        let hasError = false;
        const requiredFields = ['firstname', 'lastname', 'birthday', 'gender', 'phone_number', 'password', 'confirm_password'];
        
        requiredFields.forEach((field) => {
            if (!formData[field]) {
                setErrors((prev) => ({ ...prev, [field]: `${field.replace("_", " ")} is required.` }));
                hasError = true;
            }
        });

        if (formData.password !== formData.confirm_password) {
            setErrors((prev) => ({ ...prev, confirm_password: "Passwords do not match." }));
            hasError = true;
        }

        if (hasError) return;

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
                setSubmitError(errorData.error + ": " + errorData.details);
                return;
            }
            // Redirect to login page after successful registration
            navigate('/login'); // Adjust the path as needed
        } catch (error) {
            console.error('Error during registration:', error);
            setSubmitError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-image">
                    <img src="/AgriTayo_Logo.svg" alt="AgriTayo Logo" />
                </div>
                <div className="register-form-container">
                    <h1 className="register-title">Register</h1>
                    {submitError && <p className="register-error">{submitError}</p>}
                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="grid-container">
                            <div className="form-group">
                                <label>First Name: {errors.firstname && <p className="text-color-red">* {errors.firstname}</p>}</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Middle Name: {errors.middlename && <p className="text-color-red">* {errors.middlename}</p>}</label>
                                <input
                                    type="text"
                                    name="middlename"
                                    value={formData.middlename}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name: {errors.lastname && <p className="text-color-red">* {errors.lastname}</p>}</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Birthday: {errors.birthday && <p className="text-color-red">* {errors.birthday}</p>}</label>
                                <input
                                    type="date"
                                    name="birthday"
                                    value={formData.birthday}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Gender: {errors.gender && <p className="text-color-red">* {errors.gender}</p>}</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="form-input"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Phone Number: {errors.phone_number && <p className="text-color-red">* {errors.phone_number}</p>}</label>
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Alternative Phone Number: {errors.secondary_phone_number && <p className="text-color-red">* {errors.secondary_phone_number}</p>}</label>
                                <input
                                    type="text"
                                    name="secondary_phone_number"
                                    value={formData.secondary_phone_number}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Password: {errors.password && <p className="text-color-red">* {errors.password}</p>}</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password: {errors.confirm_password && <p className="text-color-red">* {errors.confirm_password}</p>}</label>
                                <input
                                    type="password"
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <button type="submit" className="register-button">Register</button>
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
