# Ratings and Review System

A modern web application where users can rate and review products with photo uploads, smart tag generation, and cloud-based image storage.

## Live Demo
🌐 [Frontend Live Demo](https://ratings-and-review-system-two.vercel.app)  
🔗 [Backend Live Demo](https://ratings-and-review-system-kunz.onrender.com)

## Features
- ⭐ Rate products (1-5 stars)
- 📝 Write detailed reviews
- 🏷️ Add custom tags
- 📸 Upload photos with reviews (cloud storage)
- 🖼️ Automatic image compression and optimization
- 📊 View rating summaries
- 🚫 Prevents duplicate reviews
- 📱 Fully responsive design
- 🎨 Modern UI with animations

## Tech Stack
- **Frontend**: React, Modern CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MySQL (Railway)
- **Image Storage**: Cloudinary
- **Deployment**: Vercel (Frontend), Render and Railway (Backend)

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
   
   **Backend `.env` file:**
   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=reviews_db
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   NODE_ENV=development
   ```

   **Frontend `.env` file:**
   ```bash
   REACT_APP_API_URL=http://localhost:5000/api
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
- `GET /api/products` - Get all products with ratings
- `GET /api/products/:id` - Get product details with reviews
- `POST /api/reviews` - Submit new review (with image upload)
- `GET /api/tags` - Get popular tags

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
    image_url VARCHAR(500), -- Stores Cloudinary URLs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_user_product (user_name, product_id)
);
```

## Key Features
- **Image Upload**: Automatic compression with Cloudinary cloud storage
- **Modern UI**: Responsive design with gradients and smooth animations
- **Smart Validation**: Prevents duplicates and validates all inputs
- **Fast Loading**: CDN-powered image delivery

## Contact
Feel free to reach out for any questions or suggestions!

---
**Made with ❤️ by me**