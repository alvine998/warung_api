const jwt = require('jsonwebtoken');
require("dotenv").config();
// JWT Secret Key (you should keep this in environment variables for production)
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Middleware to check if the user is authenticated
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Save decoded user data in request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
