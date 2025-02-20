// const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { getUser } = require('../service/auth'); // Replace with the actual path to your getUser function
exports.verifyUser = async (req, res, next) => {
    console.log("🔍 Auth Middleware Triggered");
    console.log("📥 Request Headers:", req.headers);

    // If it's a webhook request, skip authentication
    if (req.headers['x-webhook-request'] === 'true') {
        console.log("✅ Webhook detected, skipping authentication");
        return next();
    }

    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("❌ No Authorization Header Found");
            return res.status(401).json({ error: 'Unauthorized: No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const user = getUser(token);
        req.user = user;
        next();
    } catch (error) {
        console.error("❌ Authentication Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



