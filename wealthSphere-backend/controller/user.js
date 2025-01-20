const User = require('../models/users')
const { setUser } = require('../service/auth')
const bcrypt = require('bcrypt');

exports.signUp = async (req, res) => {
    try {
        const { username, first_name, last_name, mobile_no, password } = req.body;

        // Ensure all required fields are provided
        if (!username || !first_name || !last_name || !mobile_no || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const user = await User.create({
            username,
            first_name,
            last_name,
            mobile_no,
            password: hashedPassword, // Save the hashed password
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user._id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                mobile_no: user.mobile_no,
            }, // Exclude the password in the response
        });
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error
            return res.status(400).json({ error: 'Username already exists' });
        }

        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Case-insensitive search for username
        const user = await User.findOne({
            username: new RegExp(`^${username}$`, 'i') // Case-insensitive regex search
        });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Compare the hashed password with the entered password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Generate JWT or session token (e.g., using a function called `setUser`)
        const token = setUser(user);

        res.status(200).json({
            token,
            success: true,
            user: {
                id: user._id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                mobile_no: user.mobile_no,
            },
            message: 'Logged in successfully',
        });
    } catch (error) {
        console.error('Error during login:', error); // Log the error
        res.status(500).send('An error occurred. Please try again later.');
    }
};

