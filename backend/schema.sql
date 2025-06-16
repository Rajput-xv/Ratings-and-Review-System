CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    tags JSON,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_user_product (user_name, product_id)
);

-- inserting some sample products
INSERT INTO products (name, description, image_url) VALUES
('Wireless Earbuds', 'High-quality wireless earbuds with noise cancellation', 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300&fit=crop'),
('Gaming Laptop', 'Powerful laptop for gaming and professional work', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop'),
('Smart Watch', 'Feature-rich smartwatch with health tracking', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'),
('Bluetooth Speaker', 'Portable speaker with excellent sound quality', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop'),
('Phone Case', 'Durable protective case for smartphones', 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop');