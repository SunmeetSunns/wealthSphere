// const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { getUser } = require('../service/auth'); // Replace with the actual path to your getUser function
exports.verifyUser = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const user = getUser(token); // Verify and decode the token

        req.user = user; // Attach user to the request
        next(); // Pass control to the next middleware
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Unauthorized: Token expired.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

