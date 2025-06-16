const express = require('express');
const { connectDB } = require('./config/database');
const { setupMiddleware } = require('./middleware');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Seting up middleware
setupMiddleware(app);

// Setting up routes
app.use('/api', routes);

// Initializing database and starting server
async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

startServer();