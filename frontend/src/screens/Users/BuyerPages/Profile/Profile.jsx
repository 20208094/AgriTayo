import React, { useState, useEffect } from 'react';
const API_KEY = import.meta.env.VITE_API_KEY;
import { FaCamera, FaPencilAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Profile({ onProfileUpdate }) {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [filteredUser, setFilteredUser] = useState(null);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // State for the image preview
    const [notification, setNotification] = useState('');
    const navigate = useNavigate();

    async function fetchUserSession() {
        try {
            const response = await fetch('/api/session', {
                headers: {
                    'x-api-key': API_KEY
                }
            });
            if (response.ok) {
                const data = await response.json();
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
            setFilteredUser(user);
            if (user && user.user_image_url) {
                setImagePreview(user.user_image_url); // Set the initial image preview
            }
        }
    }, [userId, users]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilteredUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file)); // Create a local URL for the image preview
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification('');

        if (filteredUser) {
            const formData = new FormData();
            formData.append('firstname', filteredUser.firstname);
            formData.append('middlename', filteredUser.middlename);
            formData.append('lastname', filteredUser.lastname);
            formData.append('user_type_id', filteredUser.user_type_id);
            formData.append('phone_number', filteredUser.phone_number);
            formData.append('secondary_phone_number', filteredUser.secondary_phone_number)
            formData.append('birthday', filteredUser.birthday);

            if (image) {
                formData.append('image', image);
            }

            try {
                const response = await fetch(`/api/users/${filteredUser.user_id}`, {
                    method: 'PUT',
                    headers: {
                        'x-api-key': API_KEY
                    },
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    setNotification('Profile updated successfully!');
                    setImage(null); // Clear the image state
                    document.querySelector('input[name="image"]').value = ''; // Clear the file input
                    await fetchUsers(); // Refresh the user data
                    if (typeof onProfileUpdate === 'function') {
                        onProfileUpdate(); // Notify parent component
                    }
                    console.log('Update successful:', data);
                } else {
                    const errorData = await response.json();
                    setNotification(`Failed to update profile: ${errorData.message || response.statusText}`);
                    console.error('Failed to update user:', errorData);
                }
            } catch (error) {
                setNotification('Error updating profile.');
                console.error('Error updating user:', error);
            }
        }
    };

    return (
        <>
            {loading ? (
                <div className="profile-loading-container">
                    <div className="profile-loading-text">Loading...</div>
                </div>
            ) : (
                <div className="profile-page-container">
                    <div className="profile-content-container">
                        <h1 className="profile-title">My Profile</h1>
                        <p className="profile-subtitle">Manage and protect your account</p>

                        {notification && (
                            <div className={`notification ${notification.includes('successfully') ? 'success' : 'error'}`}>
                                {notification}
                            </div>
                        )}
                        {filteredUser ? (
                            <form onSubmit={handleSubmit} className="profile-form" encType="multipart/form-data">
                                <div className="profile-form-grid">

                                    <div className="profile-input-group">
                                        <div className="profile-photo-container">
                                            <img
                                                src={imagePreview || '/default-profile.png'}
                                                alt="Profile"
                                                className="profile-photo"
                                            />
                                        </div>
                                        <div className="profile-input-group">
                                            <label className="profile-label">Change Photo</label>
                                            <label htmlFor="file-input" className="custom-file-input">
                                                <FaCamera className="camera-icon" /> Choose Photo
                                                <input
                                                    type="file"
                                                    name="image"
                                                    accept="image/*"
                                                    id="file-input"
                                                    onChange={handleImageChange}
                                                    className="file-input"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="profile-input-group">
                                        <label className="profile-label">First Name</label>
                                        <input
                                            type="text"
                                            name="firstname"
                                            value={filteredUser.firstname}
                                            placeholder="First Name"
                                            onChange={handleInputChange}
                                            className="profile-input"
                                        />
                                        <label className="profile-label">Middle Name</label>
                                        <input
                                            type="text"
                                            name="middlename"
                                            value={filteredUser.middlename}
                                            placeholder="Middle Name"
                                            onChange={handleInputChange}
                                            className="profile-input"
                                        />
                                        <label className="profile-label">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastname"
                                            value={filteredUser.lastname}
                                            placeholder="Last Name"
                                            onChange={handleInputChange}
                                            className="profile-input"
                                        />
                                    </div>

                                    <div className="profile-input-group">
                                        <label className="profile-label">Phone Number</label>
                                        <div className="profile-input-wrapper">
                                            <input
                                                type="text"
                                                name="phone_number"
                                                value={filteredUser.phone_number}
                                                placeholder="Phone Number"
                                                onChange={handleInputChange}
                                                className="profile-input with-icon"
                                                readOnly
                                            />
                                            <button
                                                type='button'
                                                onClick={() => navigate('/admin/editPhoneNumber', { state: { userId } })}
                                                className='edit-icon-button'
                                            >
                                                <FaPencilAlt className="edit-icon" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="profile-input-group">
                                        <label className="profile-label">Alternative Phone Number</label>
                                        <div className="profile-input-wrapper">
                                            <input
                                                type="text"
                                                name="secondary_phone_number"
                                                value={filteredUser.secondary_phone_number}
                                                placeholder="Secondary Phone Number"
                                                onChange={handleInputChange}
                                                className="profile-input with-icon"
                                                readOnly
                                            />
                                            <button
                                                type='button'
                                                onClick={() => navigate('/admin/editAlternativeNumber', { state: { userId } })}
                                                className='edit-icon-button'
                                            >
                                                <FaPencilAlt className="edit-icon" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="profile-input-group">
                                        <label className="profile-label">Birthday</label>
                                        <input
                                            type="date"
                                            name="birthday"
                                            value={filteredUser.birthday}
                                            onChange={handleInputChange}
                                            className="profile-input"
                                        />
                                    </div>
                                    <div className=''>
                                        <button onClick={() => navigate('/admin/changePassword', { state: { userId } })}>
                                            Change your password
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="profile-submit-button"
                                >
                                    Submit
                                </button>
                            </form>
                        ) : (
                            <p className="profile-no-data">No user data found</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Profile;
