import React, { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_API_KEY;

function Profile() {
    const [users, setUsers] = useState([]);
    const [userSessions, setUserSessions] = useState('');
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
                setUserSessions(data);
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

    // Filter the user based on the session user_id
    useEffect(() => {
        if (userSessions && users.length > 0) {
            const user = users.find(user => user.user_id === userSessions.user_id);
            setFilteredUser(user);
        }
    }, [userSessions, users]);

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div style={{ padding: '50px' }}>
                    <h1 className=''>My Profile</h1>
                    <p className=''>Manage and protect your account</p>
                    {userSessions.map((usersession) =>(
                        <div key={usersession.user_id}>
                        <p>{usersession.user_id}</p>
                        </div>
                    ))}
                    {users.map((user)=> (
                        <div className='' key={user.user_id}>
                            <label className=''>Full Name</label>
                            <input
                                className=''
                                type='text'
                                value={user.firstname}
                                onChange=''
                                placeholder={user.firstname}
                            />
                        </div>
                         ))}
                        <p>No user data found</p>
                </div>
            )}
        </>
    );
}

export default Profile;