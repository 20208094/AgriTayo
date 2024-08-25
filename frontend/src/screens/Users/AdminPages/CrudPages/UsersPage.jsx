import React, { useState, useEffect } from 'react';

// API key (replace with your environment variable or API key as needed)
const API_KEY = import.meta.env.VITE_API_KEY;

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [userTypes, setUserTypes] = useState([]);
    const [formData, setFormData] = useState({
        user_id: '',
        firstname: '',
        middlename: '',
        lastname: '',
        email: '',
        password: '',
        phone_number: '',
        gender: '',
        birthday: '',
        user_type_id: '',
        verified: false,
        image: null // Added field for user image
    });
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchUserTypes();
    }, []);

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

    const fetchUserTypes = async () => {
        try {
            const response = await fetch('/api/user_types', {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setUserTypes(data);
        } catch (error) {
            console.error('Error fetching user types:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEdit ? `/api/users/${formData.user_id}` : '/api/users';
        const method = isEdit ? 'PUT' : 'POST';

        const formPayload = new FormData();
        formPayload.append('firstname', formData.firstname);
        formPayload.append('middlename', formData.middlename);
        formPayload.append('lastname', formData.lastname);
        formPayload.append('email', formData.email);
        formPayload.append('password', formData.password);
        formPayload.append('phone_number', formData.phone_number);
        formPayload.append('gender', formData.gender);
        formPayload.append('birthday', formData.birthday);
        formPayload.append('user_type_id', formData.user_type_id);
        formPayload.append('verified', formData.verified);
        if (formData.image) {
            formPayload.append('image', formData.image);
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'x-api-key': API_KEY,
                },
                body: formPayload
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchUsers();
            setFormData({
                user_id: '',
                firstname: '',
                middlename: '',
                lastname: '',
                email: '',
                password: '',
                phone_number: '',
                gender: '',
                birthday: '',
                user_type_id: '',
                verified: false,
                image: null
            });
            setIsEdit(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (user) => {
        setFormData({
            user_id: user.user_id,
            firstname: user.firstname,
            middlename: user.middlename,
            lastname: user.lastname,
            email: user.email,
            password: '', // Do not prefill password
            phone_number: user.phone_number,
            gender: user.gender,
            birthday: user.birthday,
            user_type_id: user.user_type_id,
            verified: user.verified,
            image: null // Set to null to avoid uploading old image
        });
        setIsEdit(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div style={{ padding: '50px' }}>
            <h1>Users Management</h1>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input
                    type="hidden"
                    name="user_id"
                    value={formData.user_id}
                />
                <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    required
                />
                <input
                    type="text"
                    name="middlename"
                    value={formData.middlename}
                    onChange={handleInputChange}
                    placeholder="Middle Name"
                />
                <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required={!isEdit}
                />
                <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    required
                />
                <input
                    type="text"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    placeholder="Gender"
                    required
                />
                <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    placeholder="Birthday"
                    required
                />
                <select
                    name="user_type_id"
                    value={formData.user_type_id}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select User Type</option>
                    {userTypes.map((userType) => (
                        <option key={userType.user_type_id} value={userType.user_type_id}>
                            {userType.user_type_name}
                        </option>
                    ))}
                </select>
                <label>
                    Verified:
                    <input
                        type="checkbox"
                        name="verified"
                        checked={formData.verified}
                        onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    />
                </label>
                <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                />
                <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
            </form>

            <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Email</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Phone Number</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Gender</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Birthday</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>User Type</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Verified</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Password</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Profile Picture</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.user_id}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.user_id}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                {user.firstname} {user.lastname}
                            </td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.email}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.phone_number}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.gender}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.birthday}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                {userTypes.find((type) => type.user_type_id === user.user_type_id)?.user_type_name || 'Unknown'}
                            </td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.verified ? 'Yes' : 'No'}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.password}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                {user.user_image_url && (
                                    <img
                                        src={user.user_image_url}
                                        alt={user.firstname + ' ' + user.lastname}
                                        style={{ width: '100px', height: 'auto' }}
                                    />
                                )}
                            </td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <button onClick={() => handleEdit(user)}>Edit</button>
                                <button onClick={() => handleDelete(user.user_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UsersPage;
