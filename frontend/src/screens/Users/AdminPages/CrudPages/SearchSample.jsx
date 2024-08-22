import React, { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_API_KEY;

function Profile() {
    const [users, setUsers] = useState({ firstname: '', user_id: '' }); // Initialize users as an object
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);

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

    // Function to handle changes to the input field
    const handleInputChange = (event) => {
        setUsers({
            ...users,
            firstname: event.target.value // Update only the firstname property
        });
    };

    return (
        <>
            {loading ? (
                <div>Loading...</div> // Show loading indicator
            ) : (
                <div style={{ padding: '50px' }}>
                    <h1 className=''>My Profile</h1>
                    <p className=''>Manage and protect your account</p>
                    <div className='' key={users.user_id}>
                        <label className=''>Full Name</label>
                        <input
                          className=''
                          type='text'
                          value={users.firstname}
                          onChange={handleInputChange} // Add the onChange handler here
                          placeholder={users.firstname}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default Profile;
