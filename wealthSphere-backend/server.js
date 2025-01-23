const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const portfolioRoutes = require('./router/portfolioRoutes');
const userRoute = require('./router/user');
const Counter = require('./models/counter');
const { connectDB } = require('./db');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { verifyUser } = require('./middleware/auth');

const app = express();

// Define the allowed origins based on the environment
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://deft-starship-250f12.netlify.app'] // Allow Netlify app in production
  : ['http://localhost:4200']; // Allow localhost in development

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // If there's no origin (e.g., requests from Postman or similar), allow the request
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'), false);
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies and credentials
}));

// Handle preflight requests (OPTIONS)
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.header('Origin')); // Set the specific origin that made the request
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 5000;

// Initialize routes
app.use('/api/user', userRoute);
app.use('/api/portfolio', verifyUser, portfolioRoutes);

// Initialize the counter for orderId
const initCounter = async () => {
  try {
    const existingCounter = await Counter.findById('orderId');
    if (!existingCounter) {
      await Counter.create({ _id: 'orderId', seq: 0 });
      console.log('Counter initialized with seq 0');
    }
  } catch (error) {
    console.error('Error initializing counter:', error);
  }
};

// MongoDB connection and counter initialization
connectDB()
  .then(initCounter) // Initialize counter after successful connection
  .catch(err => console.error('Error during initialization:', err));

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
