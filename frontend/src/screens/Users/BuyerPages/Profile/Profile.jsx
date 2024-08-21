import React, { useState, useEffect } from 'react';

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

    // Filter the user based on the session user_id
    useEffect(() => {
        if (userId && users.length > 0) {
            const user = users.find(user => user.user_id === userId);
            console.log('Filtered user:', user); // Logging filtered user data
            setFilteredUser(user);
        }
    }, [userId, users]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilteredUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div style={{ padding: '50px' }}>
                    <h1 className=''>My Profile</h1>
                    <p className=''>Manage and protect your account</p>
                    <p>{userId}</p>
                    {filteredUser ? (
                        <div className='' key={filteredUser.user_id}>
                            <label className=''>First Name</label>
                            <input
                                className=''
                                type='text'
                                name='firstname'
                                value={filteredUser.firstname}
                                placeholder={filteredUser.firstname}
                                onChange={handleInputChange}
                            />
                            <label className=''>Middle Name</label>
                            <input
                                className=''
                                type='text'
                                name='middlename'
                                value={filteredUser.middlename}
                                placeholder={filteredUser.middlename}
                                onChange={handleInputChange}
                            />
                            <label className=''>Last Name</label>
                            <input
                                className=''
                                type='text'
                                name='lastname'
                                value={filteredUser.lastname}
                                placeholder={filteredUser.lastname}
                                onChange={handleInputChange}
                            />
                            <label className=''>Email</label>
                            <input
                                className=''
                                type='email'
                                name='email'
                                value={filteredUser.email}
                                placeholder={filteredUser.email}
                                onChange={handleInputChange}
                            />
                            <label className=''>Phone Number</label>
                            <input
                                className=''
                                type='number'
                                name='phone_number'
                                value={filteredUser.phone_number}
                                placeholder={filteredUser.phone_number}
                                onChange={handleInputChange}
                            />
                            <label className=''>Gender</label>
                            <input
                                className=''
                                type='text'
                                name='gender'
                                value={filteredUser.gender}
                                placeholder={filteredUser.gender}
                                onChange={handleInputChange}
                            />
                            <label className=''>Birthday</label>
                            <input
                                className=''
                                type='date'
                                name='birthday'
                                value={filteredUser.birthday}
                                placeholder={filteredUser.birthday}
                                onChange={handleInputChange}
                            />
                        </div>
                    ) : (
                        <p>No user data found</p>
                    )}
                </div>
            )}
        </>
    );
}

export default Profile;
