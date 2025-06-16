import React from 'react';

const ProductCard = ({ product, onAddReview, onViewDetails }) => {
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i} className="star filled">★</span>);
        }

        if (hasHalfStar) {
            stars.push(<span key="half" className="star half">★</span>);
        }

        const remainingStars = 5 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
        }

        return stars;
    };

    return (
        <div className="product-card">
            <img 
                src={product.image_url} 
                alt={product.name} 
                className="product-image"
            />
            <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                
                <div className="rating-summary">
                    <div className="stars">
                        {renderStars(parseFloat(product.average_rating))}
                    </div>
                    <span className="rating-text">
                        {parseFloat(product.average_rating).toFixed(1)} 
                        ({product.total_reviews} reviews)
                    </span>
                </div>

                <div className="product-actions">
                    <button 
                        className="btn btn-primary" 
                        onClick={onAddReview}
                    >
                        Add Review
                    </button>
                    <button 
                        className="btn btn-secondary" 
                        onClick={onViewDetails}
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;