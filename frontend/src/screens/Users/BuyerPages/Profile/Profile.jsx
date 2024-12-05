import React, { useState, useEffect } from 'react';
const API_KEY = import.meta.env.VITE_API_KEY;
import { FaCamera, FaPencilAlt, FaSpinner, FaEye, FaEyeSlash, FaUser, FaPhone, FaCalendar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Profile({ onProfileUpdate }) {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [filteredUser, setFilteredUser] = useState(null);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // State for the image preview
    const [notification, setNotification] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
            {loading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <FaSpinner className="w-12 h-12 text-white animate-spin" />
                </div>
            ) : (
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto backdrop-blur-lg bg-opacity-90">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
                        <p className="text-gray-600 mb-6">Manage and protect your account</p>

                        {notification && (
                            <div className={`p-4 mb-6 rounded-lg ${
                                notification.includes('successfully') 
                                    ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
                                    : 'bg-red-100 text-red-700 border-l-4 border-red-500'
                            }`}>
                                {notification}
                            </div>
                        )}

                        {filteredUser ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Profile Photo Section */}
                                    <div className="col-span-full flex flex-col items-center space-y-4">
                                        <div className="relative group">
                                            <img
                                                src={imagePreview || '/default-profile.png'}
                                                alt="Profile"
                                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg transition-transform group-hover:scale-105"
                                            />
                                            <label htmlFor="file-input" 
                                                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-all">
                                                <FaCamera className="w-5 h-5 text-gray-600" />
                                                <input
                                                    type="file"
                                                    name="image"
                                                    accept="image/*"
                                                    id="file-input"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Name Fields */}
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                            <div className="flex items-center">
                                                <FaUser className="absolute ml-3 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="firstname"
                                                    value={filteredUser.firstname}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                                            <div className="flex items-center">
                                                <FaUser className="absolute ml-3 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="middlename"
                                                    value={filteredUser.middlename}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                            <div className="flex items-center">
                                                <FaUser className="absolute ml-3 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="lastname"
                                                    value={filteredUser.lastname}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <div className="flex items-center relative">
                                                <FaPhone className="absolute ml-3 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="phone_number"
                                                    value={filteredUser.phone_number}
                                                    readOnly
                                                    className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => navigate('/admin/editPhoneNumber', { state: { userId } })}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                >
                                                    <FaPencilAlt className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Phone Number</label>
                                            <div className="flex items-center relative">
                                                <FaPhone className="absolute ml-3 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="secondary_phone_number"
                                                    value={filteredUser.secondary_phone_number}
                                                    readOnly
                                                    className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => navigate('/admin/editAlternativeNumber', { state: { userId } })}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                >
                                                    <FaPencilAlt className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
                                            <button
                                                type="button"
                                                onClick={() => navigate('/admin/changePasswordOTP', { state: { userId, filteredUser } })}
                                                className="w-full pl-10 px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all transform hover:scale-[1.02]"
                                            >
                                                Change Password
                                            </button>
                                        </div>
                                    </div>

                                    {/* Additional Fields */}
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                                            <div className="flex items-center">
                                                <FaCalendar className="absolute ml-3 text-gray-400" />
                                                <input
                                                    type="date"
                                                    name="birthday"
                                                    value={filteredUser.birthday}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all transform hover:scale-[1.02] font-medium"
                                >
                                    Save Changes
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-8 text-gray-600">No user data found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
