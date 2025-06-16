const cors = require('cors');
const express = require('express');
const multer = require('multer');

// File upload setup with size limit (2MB)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 } 
});

function setupMiddleware(app) {
    const corsOptions = {
        origin: true,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    };
    
    app.use(cors(corsOptions));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
}

module.exports = { setupMiddleware, upload };