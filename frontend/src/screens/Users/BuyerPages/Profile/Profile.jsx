import React, { useState, useEffect } from 'react';
import ProfileSidebar from './ProfileComponents/ProfileSidebar';

const API_KEY = import.meta.env.VITE_API_KEY;

function Profile() {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [filteredUser, setFilteredUser] = useState(null);

    async function fetchUserSession() {
        try {
            const response = await fetch('/api/session', {
                headers: {
                    'x-api-key': API_KEY
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log('User session data:', data);
                setUserId(data.user_id);
            } else {
                console.error('Failed to fetch user session:', response.statusText);
            }
        } catch (err) {
            console.error('Error fetching user session:', err.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users', {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched users:', data);
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchUserSession();
    }, []);

    useEffect(() => {
        if (userId && users.length > 0) {
            const user = users.find(user => user.user_id === userId);
            console.log('Filtered user:', user);
            setFilteredUser(user);
        }
    }, [userId, users]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilteredUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleGenderChange = (e) => {
        const { value } = e.target;
        setFilteredUser((prevUser) => ({
            ...prevUser,
            gender: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (filteredUser) {
            try {
                const response = await fetch(`/api/users/${filteredUser.user_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY
                    },
                    body: JSON.stringify(filteredUser)
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Update successful:', data);
                } else {
                    console.error('Failed to update user:', response.statusText);
                }
            } catch (error) {
                console.error('Error updating user:', error);
            }
        }
    };

    return (
        <>
            <ProfileSidebar />
            {loading ? (
                <div className="profile-loading-container">
                    <div className="profile-loading-text">Loading...</div>
                </div>
            ) : (
                <div className="profile-content-container">
                    <h1 className="profile-title">My Profile</h1>
                    <p className="profile-subtitle">Manage and protect your account</p>
                    {filteredUser ? (
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="profile-form-grid">
                                <div className="profile-input-group">
                                    <label className="profile-label">First Name</label>
                                    <input
                                        type='text'
                                        name='firstname'
                                        value={filteredUser.firstname}
                                        placeholder='First Name'
                                        onChange={handleInputChange}
                                        className="profile-input"
                                    />
                                </div>
                                <div className="profile-input-group">
                                    <label className="profile-label">Middle Name</label>
                                    <input
                                        type='text'
                                        name='middlename'
                                        value={filteredUser.middlename}
                                        placeholder='Middle Name'
                                        onChange={handleInputChange}
                                        className="profile-input"
                                    />
                                </div>
                                <div className="profile-input-group">
                                    <label className="profile-label">Last Name</label>
                                    <input
                                        type='text'
                                        name='lastname'
                                        value={filteredUser.lastname}
                                        placeholder='Last Name'
                                        onChange={handleInputChange}
                                        className="profile-input"
                                    />
                                </div>
                                <div className="profile-input-group">
                                    <label className="profile-label">Email</label>
                                    <input
                                        type='email'
                                        name='email'
                                        value={filteredUser.email}
                                        placeholder='Email'
                                        onChange={handleInputChange}
                                        className="profile-input"
                                    />
                                </div>
                                <div className="profile-input-group">
                                    <label className="profile-label">Phone Number</label>
                                    <input
                                        type='text'
                                        name='phone_number'
                                        value={filteredUser.phone_number}
                                        placeholder='Phone Number'
                                        onChange={handleInputChange}
                                        className="profile-input"
                                    />
                                </div>
                                <div className="profile-input-group">
                                    <label className="profile-label">Gender</label>
                                    <div className="profile-radio-group">
                                        <label className="profile-radio-label">
                                            <input
                                                type='radio'
                                                name='gender'
                                                value='Male'
                                                checked={filteredUser.gender === 'Male'}
                                                onChange={handleGenderChange}
                                                className="profile-radio-input"
                                            />
                                            <span className="profile-radio-text">Male</span>
                                        </label>
                                        <label className="profile-radio-label">
                                            <input
                                                type='radio'
                                                name='gender'
                                                value='Female'
                                                checked={filteredUser.gender === 'Female'}
                                                onChange={handleGenderChange}
                                                className="profile-radio-input"
                                            />
                                            <span className="profile-radio-text">Female</span>
                                        </label>
                                        <label className="profile-radio-label">
                                            <input
                                                type='radio'
                                                name='gender'
                                                value='Other'
                                                checked={filteredUser.gender === 'Other'}
                                                onChange={handleGenderChange}
                                                className="profile-radio-input"
                                            />
                                            <span className="profile-radio-text">Other</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="profile-input-group">
                                    <label className="profile-label">Birthday</label>
                                    <input
                                        type='date'
                                        name='birthday'
                                        value={filteredUser.birthday}
                                        onChange={handleInputChange}
                                        className="profile-input"
                                    />
                                </div>
                            </div>
                            <button
                                type='submit'
                                className="profile-submit-button"
                            >
                                Submit
                            </button>
                        </form>
                    ) : (
                        <p className="profile-no-data">No user data found</p>
                    )}
                </div>
            )}
        </>
    );
}

export default Profile;
