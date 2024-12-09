import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import MainLogo from '/AgriTayo_Logo_wName.png';

const API_KEY = import.meta.env.VITE_API_KEY;

function ReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [crops, setCrops] = useState([]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        crop_id: '',
        user_id: '',
        rating: '',
        review_text: ''
    });
    const [isEdit, setIsEdit] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReviews();
        fetchCrops();
        fetchUsers();
    }, []);

    useEffect(() => {
        setFilteredReviews(reviews);
    }, [reviews]);

    const fetchReviews = async () => {
        try {
            const response = await fetch('/api/reviews', {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const fetchCrops = async () => {
        try {
            const response = await fetch('/api/crops', {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCrops(data);
        } catch (error) {
            console.error('Error fetching crops:', error);
        }
    };

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEdit ? `/api/reviews/${formData.review_id}` : '/api/reviews';
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchReviews();
            setFormData({
                crop_id: '',
                user_id: '',
                rating: '',
                review_text: ''
            });
            setIsEdit(false);
            setIsModalOpen(false);
            setCreateModalOpen(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (review) => {
        setFormData(review);
        setIsEdit(true);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setFormData({ crop_id: '', user_id: '', rating: '', review_text: '' });  // Reset form data
        setIsEdit(false);  // Not in edit mode
        setCreateModalOpen(true); // Open the modal
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/reviews/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchReviews();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    //pdf table design
    const exportToPDF = () => {
        const doc = new jsPDF('landscape');

        const tableData = filteredReviews.map(review => {
            return [
                review.review_id,
                crops.find((crop) => crop.crop_id === review.crop_id)?.crop_name,
                users.find((user) => user.user_id === review.user_id)?.firstname + ' ' + users.find((user) => user.user_id === review.user_id)?.lastname,
                review.rating,
                review.review_text,
                new Date(review.review_date).toLocaleString()
            ];
        });

        const logoWidth = 50;
        const logoHeight = 50;
        const marginBelowLogo = 5;
        const textMargin = 5;

        const pageWidth = doc.internal.pageSize.getWidth();
        const xPosition = (pageWidth - logoWidth) / 2;

        doc.addImage(MainLogo, 'PNG', xPosition, 10, logoWidth, logoHeight);
        const textYPosition = 10 + logoHeight + textMargin;
        doc.text("Reviews", xPosition + logoWidth / 2, textYPosition, { align: "center" });

        const tableStartY = textYPosition + marginBelowLogo + 5;

        doc.autoTable({
            head: [['ID', 'Crop', 'User', 'Rating', 'Review Text', 'Review Date']],
            body: tableData,
            startY: tableStartY,
            headStyles: {
                fillColor: [0, 128, 0], halign: 'center', valign: 'middle'
            },
        });

        doc.save('reviews_list.pdf');
    };

    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = reviews.filter(review => {
            const cropName = crops.find(crop => crop.crop_id === review.crop_id)?.crop_name.toLowerCase() || '';
            const userName = users.find(user => user.user_id === review.user_id)?.firstname.toLowerCase() + ' ' +
                users.find(user => user.user_id === review.user_id)?.lastname.toLowerCase() || '';
            const reviewText = review.review_text.toLowerCase();

            return (
                cropName.includes(value) ||
                userName.includes(value) ||
                reviewText.includes(value) ||
                review.rating.toString().includes(value)
            );
        });

        setFilteredReviews(filtered);
    };

    // Crop Filter Handler
    const handleFilterChange = (e) => {
        const selectedCrop = e.target.value;

        const filtered = reviews.filter(review => {
            return review.crop_id === selectedCrop || selectedCrop === '';
        });

        setFilteredReviews(filtered);
    };

    // Rating Filter Handler
    const handleRatingFilterChange = (e) => {
        const selectedRating = e.target.value;

        const filtered = reviews.filter(review => {
            return review.rating === parseInt(selectedRating) || selectedRating === '';
        });

        setFilteredReviews(filtered);
    };


    return (
        <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
            <div className="max-w-7xl mx-auto p-6 md:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-gray-800 drop-shadow-md mb-2">
                                Reviews Management
                            </h1>
                            <p className="text-gray-700 text-lg font-medium">
                                Manage and review user feedback
                            </p>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                                <span className="text-gray-800 font-medium">
                                    {filteredReviews.length} Reviews
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search, Filter, and Export Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    {/* Search Input */}
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search reviews..."
                        className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2 w-full sm:w-1/3
                            focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg mb-4 sm:mb-0"
                    />

                    {/* Filter Dropdown for Crops */}
                    <select
                        className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2 w-full sm:w-1/6
                            focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg mb-4 sm:mb-0"
                        onChange={handleFilterChange}
                    >
                        <option value="">Filter by Crop</option>
                        {crops.map((crop) => (
                            <option key={crop.crop_id} value={crop.crop_id}>
                                {crop.crop_name}
                            </option>
                        ))}
                    </select>

                    {/* Filter Dropdown for Ratings */}
                    <select
                        className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2 w-full sm:w-1/6
                            focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg mb-4 sm:mb-0"
                        onChange={handleRatingFilterChange}
                    >
                        <option value="">Filter by Rating</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>

                    {/* Add Review Button */}
                    <button
                        onClick={handleCreate}
                        className="bg-white/90 backdrop-blur-sm text-green-600 font-semibold py-2 px-4 rounded-xl
                            hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto mr-2"
                    >
                        + Review
                    </button>

                    {/* Export to PDF Button */}
                    <button
                        onClick={exportToPDF}
                        className="bg-white/90 backdrop-blur-sm text-green-600 font-semibold py-2 px-4 rounded-xl
                            hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
                    >
                        Export to PDF
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-green-600 text-white">
                            <tr>
                                {['ID', 'Crop', 'User', 'Rating', 'Review Text', 'Review Date', 'Actions'].map((header) => (
                                    <th key={header} className="px-6 py-4 text-center">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredReviews.map((review) => (
                                <tr key={review.review_id} className="hover:bg-white/50 transition-colors duration-150">
                                    <td className="px-6 py-4 text-center">{review.review_id}</td>
                                    <td className="px-6 py-4 text-center">{crops.find((crop) => crop.crop_id === review.crop_id)?.crop_name}</td>
                                    <td className="px-6 py-4 text-center">{users.find((user) => user.user_id === review.user_id)?.firstname} {users.find((user) => user.user_id === review.user_id)?.lastname}</td>
                                    <td className="px-6 py-4 text-center">{review.rating}</td>
                                    <td className="px-6 py-4 text-center">{review.review_text}</td>
                                    <td className="px-6 py-4 text-center">{new Date(review.review_date).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(review)}
                                                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700
                                                    transition-colors duration-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => { setIsDeleteModalOpen(true); setDeleteId(review.review_id); }}
                                                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600
                                                    transition-colors duration-200"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Create Modal */}
                {createModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Review</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-6">
                                        <p className="text-l font-bold mb-4" style={{ marginTop: '20px', marginBottom: '-20px' }}>Crop Name</p>
                                        <select
                                            name="crop_id"
                                            value={formData.crop_id}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            style={{ marginBottom: '-10px' }}
                                            required
                                        >
                                            <option value="">Select Crop</option>
                                            {crops.map((crop) => (
                                                <option key={crop.crop_id} value={crop.crop_id}>
                                                    {crop.crop_name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-20px' }}>User</p>
                                        <select
                                            name="user_id"
                                            value={formData.user_id}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            style={{ marginBottom: '-10px' }}
                                            required
                                        >
                                            <option value="">Select User</option>
                                            {users.map((user) => (
                                                <option key={user.user_id} value={user.user_id}>
                                                    {user.firstname} {user.lastname}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-20px' }}>Rating</p>
                                        <input
                                            type="number"
                                            name="rating"
                                            value={formData.rating}
                                            onChange={handleInputChange}
                                            placeholder="Rating (1-5)"
                                            min="1"
                                            max="5"
                                            step="0.1"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            style={{ marginBottom: '-10px' }}
                                            required
                                        />
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-20px' }}>Review Text</p>
                                        <textarea
                                            name="review_text"
                                            value={formData.review_text}
                                            onChange={handleInputChange}
                                            placeholder="Review Text"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setCreateModalOpen(false)}
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
                                            Create
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Review</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-6">
                                        <p className="text-l font-bold mb-4" style={{ marginTop: '20px', marginBottom: '-20px' }}>Crop Name</p>
                                        <select
                                            name="crop_id"
                                            value={formData.crop_id}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            style={{ marginBottom: '-10px' }}
                                            required
                                        >
                                            <option value="">Select Crop</option>
                                            {crops.map((crop) => (
                                                <option key={crop.crop_id} value={crop.crop_id}>
                                                    {crop.crop_name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-20px' }}>User</p>
                                        <select
                                            name="user_id"
                                            value={formData.user_id}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            style={{ marginBottom: '-10px' }}
                                            required
                                        >
                                            <option value="">Select User</option>
                                            {users.map((user) => (
                                                <option key={user.user_id} value={user.user_id}>
                                                    {user.firstname} {user.lastname}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-20px' }}>Rating</p>
                                        <input
                                            type="number"
                                            name="rating"
                                            value={formData.rating}
                                            onChange={handleInputChange}
                                            placeholder="Rating (1-5)"
                                            min="1"
                                            max="5"
                                            step="0.1"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            style={{ marginBottom: '-10px' }}
                                            required
                                        />
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-20px' }}>Review Text</p>
                                        <textarea
                                            name="review_text"
                                            value={formData.review_text}
                                            onChange={handleInputChange}
                                            placeholder="Review Text"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
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
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm m-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h2>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this review?</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600
                                        transition-colors duration-200"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200
                                        transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReviewsPage;
