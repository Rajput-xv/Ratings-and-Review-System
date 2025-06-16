import React, { useState } from 'react';
import axios from 'axios';
import './ReviewModal.css';

const API_URL = process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production' 
        ? 'https://ratings-and-review-system-kunz.onrender.com/api' 
        : 'http://localhost:5000/api');

const ReviewModal = ({ product, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        userName: '',
        rating: 0,
        reviewText: '',
        tags: '',
        image: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(null);

    // Image compression function
    const compressImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.7) => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file.');
            return;
        }

        // Check initial file size (5MB limit before compression)
        if (file.size > 5 * 1024 * 1024) {
            setError('Please select an image smaller than 5MB.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            let processedFile = file;
            
            // Compress image if it's larger than 500KB
            if (file.size > 500 * 1024) {
                // console.log('Compressing image...');
                processedFile = await compressImage(file);
                // console.log(`Image compressed from ${file.size} bytes to ${processedFile.size} bytes`);
            }

            // Final size check after compression
            if (processedFile.size > 2 * 1024 * 1024) {
                setError('Image is still too large after compression. Please try a smaller image.');
                setLoading(false);
                return;
            }

            setFormData(prev => ({
                ...prev,
                image: processedFile
            }));

            // Create preview
            const previewUrl = URL.createObjectURL(processedFile);
            setImagePreview(previewUrl);
            
        } catch (error) {
            console.error('Error processing image:', error);
            setError('Error processing image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleRatingClick = (rating) => {
        setFormData(prev => ({
            ...prev,
            rating
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.userName.trim()) {
            setError('Please enter your name.');
            return;
        }

        if (formData.rating === 0 && !formData.reviewText.trim()) {
            setError('Please provide either a rating or review text.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const submitData = new FormData();
            submitData.append('product_id', product.id);
            submitData.append('user_name', formData.userName.trim());
            
            if (formData.rating > 0) {
                submitData.append('rating', formData.rating);
            }
            
            if (formData.reviewText.trim()) {
                submitData.append('review_text', formData.reviewText.trim());
            }
            
            if (formData.tags.trim()) {
                submitData.append('tags', formData.tags.trim());
            }
            
            if (formData.image) {
                submitData.append('image', formData.image);
            }

            // console.log('Submitting review...');
            const response = await axios.post(`${API_URL}/reviews`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000, // 30 second timeout
            });

            // console.log('Review submitted successfully:', response.data);
            onSubmit();
            onClose();
        } catch (error) {
            console.error('Error submitting review:', error);
            
            if (error.response) {
                // Server responded with error status
                setError(error.response.data.error || 'Failed to submit review. Please try again.');
            } else if (error.request) {
                // Request was made but no response received
                setError('Network error. Please check your connection and try again.');
            } else {
                // Something else happened
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null
        }));
        setImagePreview(null);
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    // Cleanup preview URL on unmount
    React.useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Write a Review</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                
                <div className="product-info">
                    <img src={product.image_url} alt={product.name} />
                    <div>
                        <h3>{product.name}</h3>
                        <p className="product-description">{product.description}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="review-form">
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-group">
                        <label>Your Name *</label>
                        <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Rating</label>
                        <div className="rating-input">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${formData.rating >= star ? 'filled' : ''}`}
                                    onClick={() => !loading && handleRatingClick(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Review</label>
                        <textarea
                            name="reviewText"
                            value={formData.reviewText}
                            onChange={handleInputChange}
                            placeholder="Write your review..."
                            rows="4"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Tags</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            placeholder="Enter tags separated by commas (e.g., comfortable, stylish, durable)"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                        <small className="file-info">
                            Maximum file size: 5MB (will be compressed automatically)
                        </small>
                        
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Preview" />
                                <button 
                                    type="button" 
                                    className="remove-image"
                                    onClick={removeImage}
                                    disabled={loading}
                                >
                                    X
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={onClose}
                            disabled={loading}
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="submit-button"
                        >
                            {loading ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;