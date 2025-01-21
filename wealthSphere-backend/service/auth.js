const jwt=require('jsonwebtoken');
require('dotenv').config();
const secretKey=process.env.JWT_SECRET;

function setUser(user) {
    const secretKey = process.env.JWT_SECRET || 'your-secret-key'; // Use a secure key
    const expiresIn = '1h'; // Token expiration time (e.g., 1 hour)

    // Generate JWT with expiration time
    return jwt.sign(
        { 
            id: user._id, 
            username: user.username 
        },
        secretKey,
        { expiresIn }
    );
}

// Function to verify and decode the JWT
function getUser(token) {
    try {
        const secretKey = process.env.JWT_SECRET || 'your-secret-key'; // Use a secure key
        // Verify the token and decode it
        const decoded = jwt.verify(token, secretKey);
        return decoded; // Contains the user ID and username
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}
module.exports={
    setUser,
    getUser
}