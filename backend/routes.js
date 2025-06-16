const express = require('express');
const { getDB } = require('./config/database');
const { upload } = require('./middleware');

const router = express.Router();

// getting all products with ratings
router.get('/products', async (req, res) => {
    try {
        const db = getDB();
        const [products] = await db.execute(`
            SELECT p.*, 
                   COALESCE(AVG(r.rating), 0) as average_rating,
                   COUNT(r.id) as total_reviews
            FROM products p 
            LEFT JOIN reviews r ON p.id = r.product_id 
            GROUP BY p.id
        `);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// getting product details with reviews
router.get('/products/:id', async (req, res) => {
    try {
        const db = getDB();
        const productId = req.params.id;
        
        const [products] = await db.execute(`
            SELECT p.*, 
                   COALESCE(AVG(r.rating), 0) as average_rating,
                   COUNT(r.id) as total_reviews
            FROM products p 
            LEFT JOIN reviews r ON p.id = r.product_id 
            WHERE p.id = ?
            GROUP BY p.id
        `, [productId]);

        if (products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const [reviews] = await db.execute(`
            SELECT * FROM reviews 
            WHERE product_id = ? 
            ORDER BY created_at DESC
        `, [productId]);

        res.json({
            product: products[0],
            reviews: reviews
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch product details' });
    }
});

// adding review to a product
router.post('/reviews', upload.single('image'), async (req, res) => {
    try {
        const db = getDB();
        const { product_id, user_name, rating, review_text, tags } = req.body;
        
        // validating the fields
        if (!product_id || !user_name) {
            return res.status(400).json({ error: 'Product ID and user name are required' });
        }

        if (!rating && !review_text) {
            return res.status(400).json({ error: 'Either rating or review text is required' });
        }

        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // checking if user already reviewed this product
        const [existing] = await db.execute(
            'SELECT id FROM reviews WHERE user_name = ? AND product_id = ?',
            [user_name, product_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'You have already reviewed this product' });
        }

        // processing tags
        let tagsJson = null;
        if (tags && tags.trim()) {
            try {
                const tagArray = tags.split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag.length > 0);
                
                if (tagArray.length > 0) {
                    tagsJson = JSON.stringify(tagArray);
                }
            } catch (error) {
                console.error('Error processing tags:', error);
                tagsJson = null;
            }
        }

        // store image as base64
        let imageUrl = null;
        if (req.file) {
            imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }

        // inserting review of the product
        const [result] = await db.execute(`
            INSERT INTO reviews (product_id, user_name, rating, review_text, tags, image_url) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [product_id, user_name, rating || null, review_text || null, tagsJson, imageUrl]);

        res.status(201).json({ 
            message: 'Review added successfully',
            reviewId: result.insertId 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add review' });
    }
});

// getting popular tags from reviews
router.get('/tags', async (req, res) => {
    try {
        const db = getDB();
        const [rows] = await db.execute('SELECT tags FROM reviews WHERE tags IS NOT NULL');
        
        const tagCount = {};
        rows.forEach(row => {
            if (row.tags) {
                try {
                    const tags = JSON.parse(row.tags);
                    if (Array.isArray(tags)) {
                        tags.forEach(tag => {
                            tagCount[tag] = (tagCount[tag] || 0) + 1;
                        });
                    }
                } catch (error) {
                    console.error('Error parsing tags:', error);
                }
            }
        });

        const popularTags = Object.entries(tagCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([tag, count]) => ({ tag, count }));

        res.json(popularTags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
});

module.exports = router;