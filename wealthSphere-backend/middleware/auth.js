require('dotenv').config();
const jwt = require('jsonwebtoken');
const { getUser } = require('../service/auth');

exports.verifyUser = async (req, res, next) => {
    // If it's a webhook request, skip authentication
    if (req.headers['x-webhook-request'] === 'true') {
        return next();
    }

    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const user = getUser(token);
        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
