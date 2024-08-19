import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function RegisterPage() {
    const [formData, setFormData] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        email: '',
        password: '',
        phone_number: '',
        gender: '',
        birthday: '',
        user_type_id: 3, // Default user type ID
        verified: false
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                setError(errorData.error + ": " + errorData.details);
                return;
            }
            // Redirect to login page after successful registration
            navigate('/login'); // Adjust the path as needed
        } catch (error) {
            console.error('Error during registration:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: 'auto' }}>
            <h1>Register</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Middle Name:</label>
                    <input
                        type="text"
                        name="middlename"
                        value={formData.middlename}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Birthday:</label>
                    <input
                        type="date"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Gender:</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="confirm_password"
                        value={formData.confirm_password || ''}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>User Type ID:</label>
                    <input
                        type="text"
                        name="user_type_id"
                        value={formData.user_type_id}
                        onChange={handleInputChange}
                        readOnly
                    />
                </div>
                <div>
                    <label>Verified:</label>
                    <input
                        type="checkbox"
                        name="verified"
                        checked={formData.verified}
                        onChange={() => setFormData({ ...formData, verified: !formData.verified })}
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;
