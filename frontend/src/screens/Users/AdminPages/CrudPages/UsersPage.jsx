import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import MainLogo from '/AgriTayo_Logo_wName.png';

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
        image: null 
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [genderFilter, setGenderFilter] = useState('');
    const [userTypeFilter, setUserTypeFilter] = useState('');
    const [verifiedFilter, setVerifiedFilter] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
        fetchUserTypes();
    }, []);

    useEffect(() => {
        setFilteredUsers(
            users.filter(user => {
                const fullNameMatches = `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchQuery.toLowerCase());
                const genderMatches = genderFilter ? user.gender === genderFilter : true;
                const userTypeMatches = userTypeFilter ? user.user_type_id === parseInt(userTypeFilter) : true;
                const verifiedMatches = verifiedFilter !== '' ? user.verified === (verifiedFilter === 'true') : true;
                return fullNameMatches && genderMatches && userTypeMatches && verifiedMatches;
            })
        );
    }, [searchQuery, users, genderFilter, userTypeFilter, verifiedFilter]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users', {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) throw new Error('Network response was not ok');
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
            if (!response.ok) throw new Error('Network response was not ok');
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

    const handleCreate = async (e) => {
        e.preventDefault();
        await submitForm('/api/users', 'POST');
    };

    const onSubmit = (event) => {
        handleCreate(event);  
        toggleModal(false);  
      };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await submitForm(`/api/users/${formData.user_id}`, 'PUT');
        setShowEditModal(false);
    };

    const submitForm = async (url, method) => {
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
        if (formData.image) formPayload.append('image', formData.image);

        try {
            const response = await fetch(url, {
                method,
                headers: { 'x-api-key': API_KEY },
                body: formPayload
            });
            if (!response.ok) throw new Error('Network response was not ok');
            fetchUsers();
            setFormData({
                user_id: '', firstname: '', middlename: '', lastname: '', email: '', password: '',
                phone_number: '', gender: '', birthday: '', user_type_id: '', verified: false, image: null
            });
            setIsEdit(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (user) => {
        setFormData({ ...user, password: '', image: null });
        setIsEdit(true);
        setShowEditModal(true);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/users/${selectedUserId}`, {
                method: 'DELETE',
                headers: { 'x-api-key': API_KEY },
            });
            if (!response.ok) throw new Error('Network response was not ok');
            fetchUsers();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF('landscape');
        const columns = ["ID", "Name", "Email", "Phone", "Gender", "Birthday", "User Type", "Verified"];
        const data = filteredUsers.map((user) => [
            user.user_id,
            `${user.firstname} ${user.lastname}`,
            user.email,
            user.phone_number,
            user.gender,
            user.birthday,
            userTypes.find((type) => type.user_type_id === user.user_type_id)?.user_type_name || 'Unknown',
            user.verified ? 'Yes' : 'No',
        ]);

        const logoWidth = 50;
        const logoHeight = 50; 
        const pageWidth = doc.internal.pageSize.getWidth();
        const xPosition = (pageWidth - logoWidth) / 2; 
        doc.addImage(MainLogo, 'PNG', xPosition, 10, logoWidth, logoHeight); 
        doc.text("List of Users", xPosition + logoWidth / 2, logoHeight + 15, { align: "center" });
        doc.autoTable({ head: [columns], body: data, startY: logoHeight + 20 });
        doc.save('user-reports.pdf');
    };

    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(true);
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
      };


    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6 text-center text-[#00B251]">Users Management</h1>
            
            {/* Button to open the modal */}
            <button
                onClick={toggleModal}
                className="p-3 bg-[#00B251] text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 mb-6"
            >
                + User
            </button>

      {/* Modal */}
        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative max-h-[80vh] overflow-y-auto">
                    <h2 className="text-2xl text-[#00B251] font-semibold">Add User</h2>

                    <form onSubmit={onSubmit} encType="multipart/form-data" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mb-8">
                        <input type="hidden" name="user_id" value={formData.user_id} />

                        {["Your first name", "middlename", "lastname", "email", "phone_number", "gender", "birthday"].map((field) => (
                        <div key={field} className="mb-2">
                            <label htmlFor={field} className="text-l font-bold mb-1">
                            {field.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
                            </label>
                            <input
                            type={field === "email" ? "email" : "text"}
                            id={field}
                            name={field}
                            value={formData[field]}
                            onChange={handleInputChange}
                            placeholder={field.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
                            required
                            className="p-2 border border-gray-300 rounded w-full"
                            />
                        </div>
                        ))}

                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-15px' }}>User Type</p>
                        <select
                        name="user_type_id"
                        value={formData.user_type_id}
                        onChange={handleInputChange}
                        required
                        className="p-2 border border-gray-300 rounded"
                        >
                        <option value="">Select User Type</option>
                        {userTypes.map((type) => (
                            <option key={type.user_type_id} value={type.user_type_id}>
                            {type.user_type_name}
                            </option>
                        ))}
                        </select>

                        <label className="flex items-center">
                        Verified:
                        <input
                            type="checkbox"
                            name="verified"
                            checked={formData.verified}
                            onChange={(e) => handleInputChange({ target: { name: 'verified', value: e.target.checked } })}
                            className="ml-2"
                        />
                        </label>

                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-15px' }}>Profile Picture</p>
                        <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        className="p-2 border border-gray-300 rounded"
                        />

                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-gray-400 text-white p-2 rounded mr-2"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                           
                            <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">
                                Create
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        )}


            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center mb-6 gap-6">
                <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <select
                    value={userTypeFilter}
                    onChange={(e) => setUserTypeFilter(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="">All User Types</option>
                    <option value="1">Admin</option>
                    <option value="2">Seller</option>
                    <option value="3">Buyer</option>
                </select>
                <select
                    value={verifiedFilter}
                    onChange={(e) => setVerifiedFilter(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="">All Verified Status</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>

                <input
                    type="text"
                    placeholder="Search users"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                    style={{ width: '570px' }} // Adjust the width as needed
                />

                <button onClick={generatePDF} className="bg-green-600 text-white py-2 px-4 rounded">
                    Export to PDF
                </button>
            </div>

            <div className="flex-1 overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-green-600 text-white">
                        <tr>
                            {["ID", "Name", "Email", "Phone", "Gender", "Birthday", "User Type", "Verified", "Profile Picture", "Actions"].map((header) => (
                                <th key={header} className="p-1 border-b whitespace-nowrap">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.user_id} className="even:bg-gray-100">
                                <td className="p-1 border-b">{user.user_id}</td>
                                <td className="p-1 border-b">{`${user.firstname} ${user.lastname}`}</td>
                                <td className="p-1 border-b truncate max-w-xs">{user.email}</td>
                                <td className="p-1 border-b">{user.phone_number}</td>
                                <td className="p-1 border-b">{user.gender}</td>
                                <td className="p-1 border-b">{user.birthday}</td>
                                <td className="p-1 border-b">
                                    {userTypes.find((type) => type.user_type_id === user.user_type_id)?.user_type_name || 'Unknown'}
                                </td>
                                <td className="p-1 border-b">{user.verified ? 'Yes' : 'No'}</td>
                                <td className="p-1 border-b">
                                    {user.user_image_url && (
                                        <img src={user.user_image_url} alt={`${user.firstname} ${user.lastname}`} className="w-8 h-8 rounded-full" />
                                    )}
                                </td>
                                <td className="border border-gray-200 p-4 flex justify-center items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="bg-green-600 text-white px-3 py-1 rounded mb-1 text-xs"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedUserId(user.user_id);
                                            setShowDeleteModal(true);
                                        }}
                                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded w-96">
                        <h2 className="text-2xl font-bold mb-4 text-green-600">Edit User</h2>
                        <form onSubmit={handleUpdate} className="grid gap-4">
                            {["firstname", "middlename", "lastname", "email", "phone_number", "gender", "birthday"].map((field) => (
                                <input
                                    key={field}
                                    type={field === "email" ? "email" : "text"}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleInputChange}
                                    placeholder={field.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
                                    required
                                    className="p-2 border border-gray-300 rounded"
                                />
                            ))}
                            <select
                                name="user_type_id"
                                value={formData.user_type_id}
                                onChange={handleInputChange}
                                required
                                className="p-2 border border-gray-300 rounded"
                            >
                                <option value="">Select User Type</option>
                                {userTypes.map((type) => (
                                    <option key={type.user_type_id} value={type.user_type_id}>
                                        {type.user_type_name}
                                    </option>
                                ))}
                            </select>
                            <label className="flex items-center">
                                Verified:
                                <input
                                    type="checkbox"
                                    name="verified"
                                    checked={formData.verified}
                                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                                    className="ml-2"
                                />
                            </label>
                            <input type="file" name="image" onChange={handleFileChange} className="p-2 border border-gray-300 rounded" />

                            <div className="flex justify-end mt-4">
                                <button onClick={() => setShowEditModal(false)}  className="bg-gray-500 text-white px-4 py-2 mr-2 rounded">Cancel</button>
                                <button type="submit" className="bg-[#00B251] text-white px-4 py-2 rounded">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded w-96">
                        <h2 className="text-2xl font-bold mb-4 text-red-500">Confirm Delete</h2>
                        <p>Are you sure you want to delete this user?</p>
                        <div className="mt-4 flex justify-between">
                            <button onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 rounded">Delete</button>
                            <button onClick={() => setShowDeleteModal(false)} className="bg-gray-300 text-black py-2 px-4 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UsersPage;
