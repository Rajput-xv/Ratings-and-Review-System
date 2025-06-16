# Ratings and Review System

A web application where users can rate and review products with photo uploads and smart tag generation.

## Live Demo
[Frontend Live Demo](https://ratings-and-review-system-two.vercel.app)

[Backend Live Demo](https://ratings-and-review-system-kunz.onrender.com)

## Features
- ⭐ Rate products (1-5 stars)
- 📝 Write detailed reviews
- 🏷️ Add custom tags
- 📸 Upload photos with reviews
- 📊 View rating summaries
- 🚫 Prevents duplicate reviews

## Tech Stack
- **Frontend**: React, CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Deployment**: Vercel (Frontend), Render (Backend)


## Quick Setup

1. **Clone & Install**
   ```bash
    git clone https://github.com/yourusername/Ratings-and-Review-System.git
    cd Ratings-and-Review-System

    # Backend setup
    cd backend
    npm install

    # Frontend setup  
    cd ../frontend
    npm install
   ```

2. **Environment Setup**
    
    Create a `.env` file in the backend directory.
   ```bash
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=reviews_db
    NODE_ENV=development
   ```

3. **Run Application**
   ```bash
    # Start backend
    cd backend
    npm run dev

    # Start frontend 
    cd frontend
    npm start
    ```
Visit http://localhost:3000 to access the application.

## API Endpoints
- `GET /api/products` - Get List of all products with ratings
- `GET /api/products/:id` - Get Product details with reviews
- `POST /api/reviews` - Submit new review
- `GET /api/tags` - Get Popular tags

## Database Schema
    ```sql
    -- Products table
    CREATE TABLE products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Reviews table  
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
    ```

## Contact
Feel free to reach out for any questions or suggestions!