const cors = require('cors');
const express = require('express');
const multer = require('multer');

// File upload setup
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // making 5MB limit for file size uploads
});

function setupMiddleware(app) {
    app.use(cors());
    app.use(express.json());
}

module.exports = { setupMiddleware, upload };