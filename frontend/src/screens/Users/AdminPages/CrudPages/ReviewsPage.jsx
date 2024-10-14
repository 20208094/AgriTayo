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
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (review) => {
        setFormData(review);
        setIsEdit(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/reviews/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchReviews();
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
            theme: 'grid',
            startY: tableStartY, 
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

    return (
        <div style={{ padding: '50px' }}>
            <h1>Reviews Management</h1>

            <form onSubmit={handleSubmit}>
                <select
                    name="crop_id"
                    value={formData.crop_id}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Crop</option>
                    {crops.map((crop) => (
                        <option key={crop.crop_id} value={crop.crop_id}>
                            {crop.crop_name}
                        </option>
                    ))}
                </select>
                <select
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select User</option>
                    {users.map((user) => (
                        <option key={user.user_id} value={user.user_id}>
                            {user.firstname} {user.lastname}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    placeholder="Rating (1-5)"
                    min="1"
                    max="5"
                    step="0.1"
                    required
                />
                <textarea
                    name="review_text"
                    value={formData.review_text}
                    onChange={handleInputChange}
                    placeholder="Review Text"
                    required
                ></textarea>
                <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search reviews..."
                    style={{ marginBottom: '20px', padding: '8px' }}
                />

                <button onClick={exportToPDF} style={{ marginBottom: '20px', padding: '8px' }}>Export to PDF</button>
            </div>
            
            <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Crop</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>User</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Rating</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Review Text</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Review Date</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReviews.map((review) => (
                        <tr key={review.review_id}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{review.review_id}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{crops.find((crop) => crop.crop_id === review.crop_id)?.crop_name}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{users.find((user) => user.user_id === review.user_id)?.firstname} {users.find((user) => user.user_id === review.user_id)?.lastname}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{review.rating}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{review.review_text}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(review.review_date).toLocaleString()}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <button onClick={() => handleEdit(review)}>Edit</button>
                                <button onClick={() => handleDelete(review.review_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReviewsPage;
