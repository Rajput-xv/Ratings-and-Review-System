# Ratings and Review System

A web application for product ratings and reviews.

## Quick Start

1. **Database Setup**
   ```sql
   mysql -u root -p < backend/schema.sql
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend  
   npm install
   npm start
   ```

4. **Access**: Open http://localhost:3000

## Features
- ⭐ Rate products (1-5 stars)
- 📝 Write detailed reviews
- 🏷️ Add custom tags
- 📸 Upload review photos
- 📊 View rating summaries
- 🚫 Prevents duplicate reviews

## API Endpoints
- `GET /api/products` - List all products
- `GET /api/products/:id` - Product details with reviews
- `POST /api/reviews` - Submit new review
- `GET /api/tags` - Popular tags