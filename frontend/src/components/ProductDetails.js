import React from 'react';

const ProductDetails = ({ data, onClose }) => {
    const { product, reviews } = data;

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i} className="star filled">★</span>);
        }
        
        const remainingStars = 5 - fullStars;
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
        }
        
        return stars;
    };

    const parseTags = (tagsData) => {
        if (!tagsData) return [];
        
        try {
            if (Array.isArray(tagsData)) return tagsData;
            
            if (typeof tagsData === 'string') {
                return JSON.parse(tagsData);
            }
            
            return [];
        } catch (error) {
            console.error('Error parsing tags:', error);
            if (typeof tagsData === 'string') {
                return tagsData.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
            return [];
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content large" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{product.name}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="product-details">
                    <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="product-detail-image"
                    />
                    
                    <p className="product-detail-description">{product.description}</p>
                    
                    <div className="rating-summary large">
                        <div className="stars">
                            {renderStars(parseFloat(product.average_rating))}
                        </div>
                        <span className="rating-text">
                            {parseFloat(product.average_rating).toFixed(1)} 
                            ({product.total_reviews} reviews)
                        </span>
                    </div>

                    <div className="reviews-section">
                        <h3>Customer Reviews</h3>
                        {reviews.length === 0 ? (
                            <p className="no-reviews">No reviews yet. Be the first to review!</p>
                        ) : (
                            <div className="reviews-list">
                                {reviews.map(review => (
                                    <div key={review.id} className="review-item">
                                        <div className="review-header">
                                            <strong>{review.user_name}</strong>
                                            <span className="review-date">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {review.rating && (
                                            <div className="review-rating">
                                                {renderStars(review.rating)}
                                            </div>
                                        )}

                                        {review.review_text && (
                                            <p className="review-text">{review.review_text}</p>
                                        )}

                                        {review.tags && (
                                            <div className="review-tags">
                                                {parseTags(review.tags).map((tag, index) => (
                                                    <span key={index} className="tag">{tag}</span>
                                                ))}
                                            </div>
                                        )}

                                        {review.image_url && (
                                            <img 
                                                src={review.image_url} 
                                                alt="Review" 
                                                className="review-image"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;