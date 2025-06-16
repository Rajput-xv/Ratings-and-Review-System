import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production' 
        ? 'https://ratings-and-review-system-kunz.onrender.com/api' 
        : 'http://localhost:5000/api');

const ReviewModal = ({ product, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        user_name: '',
        rating: 0,
        review_text: '',
        tags: '',
        image: null
    });
    const [hoveredRating, setHoveredRating] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleStarClick = (rating) => {
        setFormData(prev => ({
            ...prev,
            rating
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.user_name.trim()) {
            alert('Please enter your name');
            return;
        }

        if (!formData.rating && !formData.review_text.trim()) {
            alert('Please provide either a rating or review text');
            return;
        }

        setLoading(true);

        try {
            const submitData = new FormData();
            submitData.append('product_id', product.id);
            submitData.append('user_name', formData.user_name);
            
            if (formData.rating) {
                submitData.append('rating', formData.rating);
            }
            
            if (formData.review_text.trim()) {
                submitData.append('review_text', formData.review_text);
            }
            
            if (formData.tags.trim()) {
                submitData.append('tags', formData.tags);
            }
            
            if (formData.image) {
                submitData.append('image', formData.image);
            }

            await axios.post(`${API_URL}/reviews`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('Review submitted successfully!');
            onSubmit();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`star clickable ${
                        i <= (hoveredRating || formData.rating) ? 'filled' : 'empty'
                    }`}
                    onClick={() => handleStarClick(i)}
                    onMouseEnter={() => setHoveredRating(i)}
                    onMouseLeave={() => setHoveredRating(0)}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add Review for {product.name}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="review-form">
                    <div className="form-group">
                        <label>Your Name *</label>
                        <input
                            type="text"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Rating</label>
                        <div className="star-rating">
                            {renderStars()}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Your Review</label>
                        <textarea
                            name="review_text"
                            value={formData.review_text}
                            onChange={handleInputChange}
                            rows="4"
                            placeholder="Share your experience with this product..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Tags (comma separated)</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            placeholder="e.g., comfortable, durable, good value"
                        />
                    </div>

                    <div className="form-group">
                        <label>Add Photo (optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;