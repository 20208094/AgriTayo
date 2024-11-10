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
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6 text-center text-[#00B251]">Reviews Management</h1>

            {/* Button */}
            <button
                onClick={() => handleCreate(true)}
                className="p-3 bg-[#00B251] text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 mb-6"
            >
                + Review
            </button>

            {createModalOpen && (
                <div className="fixed inset-0  bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <h2 className="text-2xl text-[#00B251] font-semibold">Add Review</h2>
                        <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            <p className="text-l font-bold mb-4" style={{ marginTop: '20px',marginBottom: '-20px' }}>Crop Name</p>
                                <select
                                    name="crop_id"
                                    value={formData.crop_id}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    required
                                />
                            </div>

                            <p className="text-l font-bold mb-4" style={{ marginTop: '20px',marginBottom: '-20px' }}>Review Text</p>
                                <textarea
                                    name="review_text"
                                    value={formData.review_text}
                                    onChange={handleInputChange}
                                    placeholder="Review Text"
                                    className="w-full mt-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                ></textarea>
                        </form>
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={() => setCreateModalOpen(false)}
                                className="bg-gray-400 text-white p-2 rounded mr-2"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={(e) => {
                                    handleSubmit(e); 
                                    setCreateModalOpen(false); 
                                }}
                                className="bg-green-600 text-white p-2 rounded"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search, Filter, and Export Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                {/* Search Input */}
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search reviews..."
                    className="p-3 w-full sm:w-1/3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 sm:mb-0"
                />

                {/* Filter Dropdown for Crops */}
                <select
                    className="p-3 w-full sm:w-1/6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 sm:mb-0"
                    onChange={handleFilterChange} // <-- New filter change handler
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
                    className="p-3 w-full sm:w-1/6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 sm:mb-0"
                    onChange={handleRatingFilterChange} // <-- New rating filter change handler
                >
                    <option value="">Filter by Rating</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>

                {/* Export to PDF Button */}
                <button onClick={exportToPDF} className="p-3 w-full sm:w-auto bg-[#00B251] text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300">
                    Export to PDF
                </button>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-[#00B251] text-white">
                        <tr>
                            <th className="p-3 border border-gray-300">ID</th>
                            <th className="p-3 border border-gray-300">Crop</th>
                            <th className="p-3 border border-gray-300">User</th>
                            <th className="p-3 border border-gray-300">Rating</th>
                            <th className="p-3 border border-gray-300">Review Text</th>
                            <th className="p-3 border border-gray-300">Review Date</th>
                            <th className="p-3 border border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReviews.map((review) => (
                            <tr key={review.review_id} className="bg-white hover:bg-gray-100 transition duration-300">
                                <td className="p-3 border border-gray-300">{review.review_id}</td>
                                <td className="p-3 border border-gray-300">{crops.find((crop) => crop.crop_id === review.crop_id)?.crop_name}</td>
                                <td className="p-3 border border-gray-300">{users.find((user) => user.user_id === review.user_id)?.firstname} {users.find((user) => user.user_id === review.user_id)?.lastname}</td>
                                <td className="p-3 border border-gray-300">{review.rating}</td>
                                <td className="p-3 border border-gray-300">{review.review_text}</td>
                                <td className="p-3 border border-gray-300">{new Date(review.review_date).toLocaleString()}</td>
                                <td className="p-2 border border-gray-200 text-center space-x-2">
                                    <button onClick={() => handleEdit(review)} className="bg-green-600 text-white p-2 rounded mr-2">Edit</button>
                                    <button onClick={() => { setIsDeleteModalOpen(true); setDeleteId(review.review_id); }} className="bg-red-500 text-white p-2 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                    <h2 className="text-2xl text-[#00B251] font-semibold">Edit Review</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6">
                                <p className="text-l font-bold mb-4" style={{ marginTop: '20px',marginBottom: '-20px' }}>Crop Name</p>
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
                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-400 text-white p-2 rounded mr-2">
                                Cancel
                                </button>
                                <button type="submit" className="bg-green-600 text-white p-2 rounded">
                                    {isEdit ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to delete this review?</p>
                        <div className="mt-6 flex justify-between">
                            <button
                                onClick={handleDelete}
                                className="p-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="p-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReviewsPage;
