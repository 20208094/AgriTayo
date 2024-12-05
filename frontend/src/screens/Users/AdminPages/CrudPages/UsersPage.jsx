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
        password: '',
        phone_number: '',
        gender: '',
        birthday: '',
        user_type_id: '',
        image: null 
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [genderFilter, setGenderFilter] = useState('');
    const [userTypeFilter, setUserTypeFilter] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchUserTypes();
    }, []);

    useEffect(() => {
        setFilteredUsers(
            users.filter(user => {
                const searchValue = searchQuery.toLowerCase();
                const fullNameMatches = `${user.firstname} ${user.middlename} ${user.lastname}`.toLowerCase().includes(searchValue);
                const phoneMatches = user.phone_number?.toLowerCase().includes(searchValue) || user.secondary_phone_number?.toLowerCase().includes(searchValue);
                
                const userTypeName = userTypes.find(type => type.user_type_id === user.user_type_id)?.user_type_name || '';
                const userTypeMatches = userTypeName.toLowerCase().includes(searchValue);
    
                const genderMatches = genderFilter ? user.gender === genderFilter : true;
                const userTypeFilterMatches = userTypeFilter ? user.user_type_id === parseInt(userTypeFilter) : true;
    
                return (fullNameMatches || phoneMatches || userTypeMatches) && genderMatches && userTypeFilterMatches;
            })
        );
    }, [searchQuery, users, genderFilter, userTypeFilter, userTypes]);

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
        formPayload.append('password', formData.password);
        formPayload.append('phone_number', formData.phone_number);
        formPayload.append('secondary_phone_number', formData.secondary_phone_number);
        formPayload.append('gender', formData.gender);
        formPayload.append('birthday', formData.birthday);
        formPayload.append('user_type_id', formData.user_type_id);
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
                user_id: '', firstname: '', middlename: '', lastname: '', password: '',
                phone_number: '', secondary_phone_number: '', gender: '', birthday: '', user_type_id: '', image: null
            });
            
            setIsEdit(false);
            setShowModal(false);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (user) => {
        setFormData({
            ...user,
            password: '',
            image: null
        });
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
        const columns = ["ID", "Name", "Phone", "Gender", "Birthday", "User Type",];
        const data = filteredUsers.map((user) => [
            user.user_id,
            `${user.firstname} ${user.lastname}`,
            user.phone_number,
            user.gender,
            user.birthday,
            userTypes.find((type) => type.user_type_id === user.user_type_id)?.user_type_name || 'Unknown',
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

    const toggleModal = () => {
        setShowModal(true);
        setFormData({
            user_id: '',
            firstname: '',
            middlename: '',
            lastname: '',
            password: '',
            phone_number: '',
            secondary_phone_number: '',
            gender: '',
            birthday: '',
            user_type_id: '',
            image: null 
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
            <div className="max-w-7xl mx-auto p-6 md:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-white drop-shadow-md mb-2">
                                Users Management
                            </h1>
                            <p className="text-white/80 text-lg font-medium">
                                Manage and organize system users
                            </p>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                                <span className="text-white font-medium">
                                    {filteredUsers.length} Users
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                    <button
                        onClick={toggleModal}
                        className="bg-white/90 backdrop-blur-sm text-green-600 font-semibold py-2 px-4 rounded-xl
                            hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
                    >
                        + Add User
                    </button>

                    <button 
                        onClick={generatePDF} 
                        className="bg-white/90 backdrop-blur-sm text-green-600 font-semibold py-2 px-4 rounded-xl
                            hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
                    >
                        Export to PDF
                    </button>
                </div>

                {/* Filters Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <select
                            value={genderFilter}
                            onChange={(e) => setGenderFilter(e.target.value)}
                            className="p-2 rounded-xl border border-gray-200 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="">All Genders</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>

                        <select
                            value={userTypeFilter}
                            onChange={(e) => setUserTypeFilter(e.target.value)}
                            className="p-2 rounded-xl border border-gray-200 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="">All User Types</option>
                            <option value="1">Admin</option>
                            <option value="2">Seller</option>
                            <option value="3">Buyer</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="p-2 rounded-xl border border-gray-200 focus:ring-green-500 focus:border-green-500 flex-1"
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-green-600 text-white">
                                <tr>
                                    {["ID", "Name", "Phone Number", "Alt. Phone Number", "Gender", "Birthday", "User Type", "Profile Picture", "Actions"].map((header) => (
                                        <th key={header} className="px-6 py-4 text-left">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.user_id} className="hover:bg-white/50 transition-colors duration-150">
                                        <td className="px-6 py-4">{user.user_id}</td>
                                        <td className="px-6 py-4">{`${user.firstname} ${user.lastname}`}</td>
                                        <td className="px-6 py-4">{user.phone_number}</td>
                                        <td className="px-6 py-4">{user.secondary_phone_number}</td>
                                        <td className="px-6 py-4">{user.gender}</td>
                                        <td className="px-6 py-4">{user.birthday}</td>
                                        <td className="px-6 py-4">
                                            {userTypes.find((type) => type.user_type_id === user.user_type_id)?.user_type_name || 'Unknown'}
                                        </td>
                                       
                                        <td className="px-6 py-4">
                                            {user.user_image_url && (
                                                <img src={user.user_image_url} alt={`${user.firstname} ${user.lastname}`} className="w-8 h-8 rounded-full" />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 border border-gray-200 p-4 flex justify-center items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="bg-green-600 text-white px-3 py-1 rounded mb-1 text-xs hover:bg-green-700 transition-colors duration-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedUserId(user.user_id);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors duration-200"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add/Edit User Modal */}
                {(showModal || showEditModal) && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    {isEdit ? 'Edit User' : 'Add New User'}
                                </h2>
                                <form onSubmit={isEdit ? handleUpdate : handleCreate} encType="multipart/form-data" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {["firstname", "middlename", "lastname"].map((field) => (
                                            <div key={field}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                                </label>
                                                <input
                                                    type="text"
                                                    name={field}
                                                    value={formData[field]}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {["phone_number", "secondary_phone_number"].map((field) => (
                                            <div key={field}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {field === "phone_number" ? "Phone Number" : "Alternative Phone"}
                                                </label>
                                                <input
                                                    type="text"
                                                    name={field}
                                                    value={formData[field]}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                    required={field === "phone_number"}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                required
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Others">Others</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                                            <input
                                                type="date"
                                                name="birthday"
                                                value={formData.birthday}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                                        <select
                                            name="user_type_id"
                                            value={formData.user_type_id}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            required
                                        >
                                            <option value="">Select User Type</option>
                                            {userTypes.map((type) => (
                                                <option key={type.user_type_id} value={type.user_type_id}>
                                                    {type.user_type_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                                        <input
                                            type="file"
                                            name="image"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowModal(false);
                                                setShowEditModal(false);
                                                setIsEdit(false);
                                            }}
                                            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200
                                                transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700
                                                transition-colors duration-200"
                                        >
                                            {isEdit ? 'Update User' : 'Add User'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 m-4">
                            <h2 className="text-2xl font-bold text-red-500 mb-4">Confirm Delete</h2>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
                            <div className="flex justify-end gap-3">
                                <button 
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200
                                        transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600
                                        transition-colors duration-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UsersPage;
