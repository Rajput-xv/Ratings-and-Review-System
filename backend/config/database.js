const mysql = require('mysql2/promise');
require('dotenv').config();

let dbConfig;

if (process.env.DATABASE_URL) {
    // Parse Railway DATABASE_URL
    const url = new URL(process.env.DATABASE_URL);
    dbConfig = {
        host: url.hostname,
        port: url.port,
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1), // Removing leading slash
        ssl: { rejectUnauthorized: false }
    };
} else {
    // Local development config
    dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'ratings_db',
        port: process.env.DB_PORT || 3306
    };
}

let db;

async function connectDB() {
    try {
        db = await mysql.createConnection(dbConfig);
        console.log('Connected to database');
        return db;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}

function getDB() {
    return db;
}

module.exports = { connectDB, getDB };