import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';
import ReviewModal from './components/ReviewModal';
import ProductDetails from './components/ProductDetails';
import './App.css';

const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://ratings-and-review-system-kunz.onrender.com/api' 
    : '/api';

function App() {
    const [products, setProducts] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productDetails, setProductDetails] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}/products`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    const openReviewModal = (product) => {
        setSelectedProduct(product);
        setShowReviewModal(true);
    };

    const openProductDetails = async (productId) => {
        try {
            const response = await axios.get(`${API_URL}/products/${productId}`);
            setProductDetails(response.data);
            setShowProductDetails(true);
        } catch (error) {
            console.error('Error loading product details:', error);
        }
    };

    const handleReviewSubmitted = () => {
        setShowReviewModal(false);
        loadProducts();
    };

    return (
        <div className="App">
            <header className="app-header">
                <h1>Product Reviews & Ratings</h1>
                <p>Share your experience with our products</p>
            </header>

            <main className="main-content">
                <div className="products-grid">
                    {products.map(product => (
                        <ProductCard 
                            key={product.id}
                            product={product}
                            onAddReview={() => openReviewModal(product)}
                            onViewDetails={() => openProductDetails(product.id)}
                        />
                    ))}
                </div>
            </main>

            {showReviewModal && (
                <ReviewModal 
                    product={selectedProduct}
                    onClose={() => setShowReviewModal(false)}
                    onSubmit={handleReviewSubmitted}
                />
            )}

            {showProductDetails && (
                <ProductDetails 
                    data={productDetails}
                    onClose={() => setShowProductDetails(false)}
                />
            )}
        </div>
    );
}

export default App;