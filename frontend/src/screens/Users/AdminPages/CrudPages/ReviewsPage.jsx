import React, { useState, useEffect } from 'react';

function ReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [crops, setCrops] = useState([]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        crop_id: '',
        user_id: '',
        rating: '',
        review_text: ''
    });
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchReviews();
        fetchCrops();
        fetchUsers();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await fetch('/api/reviews');
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
            const response = await fetch('/api/crops');
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
            const response = await fetch('/api/users');
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
                    'Content-Type': 'application/json'
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
            const response = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
        }
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
                    {reviews.map((review) => (
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
