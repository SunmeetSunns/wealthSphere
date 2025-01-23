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

// Middleware to set CORS headers (Allow all origins)
app.use(cors({
  origin: '*',  // Allow all origins
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],  // Allow the required methods
  credentials: true,  // Allow cookies to be sent with the request
}));

// Allowing CORS headers explicitly for other purposes if necessary
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');  // Allow all origins
  res.header('Access-Control-Allow-Credentials', 'true');  // Allow cookies and credentials
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');  // Methods allowed
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // Headers allowed
  next();
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
