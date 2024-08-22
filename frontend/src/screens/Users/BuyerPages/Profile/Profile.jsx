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
                console.log('User session data:', data); // Logging user session data
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
            console.log('Fetched users:', data); // Logging users data
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
            console.log('Filtered user:', user); // Logging filtered user data
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
                <div className="flex justify-center items-center h-screen">
                    <div>Loading...</div>
                </div>
            ) : (
                <div className="p-8 ml-72 mt-10">
                    <h1 className="text-3xl font-bold mb-4">My Profile</h1>
                    <p className="text-gray-600 mb-6">Manage and protect your account</p>
                    {filteredUser ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        type='text'
                                        name='firstname'
                                        value={filteredUser.firstname}
                                        placeholder='First Name'
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                                    <input
                                        type='text'
                                        name='middlename'
                                        value={filteredUser.middlename}
                                        placeholder='Middle Name'
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        type='text'
                                        name='lastname'
                                        value={filteredUser.lastname}
                                        placeholder='Last Name'
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type='email'
                                        name='email'
                                        value={filteredUser.email}
                                        placeholder='Email'
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input
                                        type='text'
                                        name='phone_number'
                                        value={filteredUser.phone_number}
                                        placeholder='Phone Number'
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                                    <div className="mt-1">
                                        <label className="inline-flex items-center mr-4">
                                            <input
                                                type='radio'
                                                name='gender'
                                                value='Male'
                                                checked={filteredUser.gender === 'Male'}
                                                onChange={handleGenderChange}
                                                className="form-radio"
                                            />
                                            <span className="ml-2">Male</span>
                                        </label>
                                        <label className="inline-flex items-center mr-4">
                                            <input
                                                type='radio'
                                                name='gender'
                                                value='Female'
                                                checked={filteredUser.gender === 'Female'}
                                                onChange={handleGenderChange}
                                                className="form-radio"
                                            />
                                            <span className="ml-2">Female</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type='radio'
                                                name='gender'
                                                value='Other'
                                                checked={filteredUser.gender === 'Other'}
                                                onChange={handleGenderChange}
                                                className="form-radio"
                                            />
                                            <span className="ml-2">Other</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Birthday</label>
                                    <input
                                        type='date'
                                        name='birthday'
                                        value={filteredUser.birthday}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                            </div>
                            <button
                                type='submit'
                                className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Submit
                            </button>
                        </form>
                    ) : (
                        <p>No user data found</p>
                    )}
                </div>
            )}
        </>
    );
}

export default Profile;
