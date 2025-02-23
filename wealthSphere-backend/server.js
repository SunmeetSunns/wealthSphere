const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const portfolioRoutes = require('./router/portfolioRoutes');
const userRoute = require('./router/user');
const webhookRoutes=require('./router/webhookRoutes');
const Counter = require('./models/counter');
const { connectDB } = require('./db');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { verifyUser } = require('./middleware/auth');

const app = express();

// Define the allowed origins based on the environment
const allowedOrigins = [
  'http://localhost:4200', // Allow Angular dev server
  'https://deft-starship-250f12.netlify.app', 
  'https://coruscating-lily-74a6c1.netlify.app',
  'https://dialogflow.cloud.google.com', // Allow Dialogflow requests
  'https://88ef-2405-201-6805-f8f3-9130-66d2-a26a-4b8d.ngrok-free.app' // Replace with actual ngrok URL
];


// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


// Handle preflight requests (OPTIONS)
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.header('Origin') || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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
app.use('/api',webhookRoutes);

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
