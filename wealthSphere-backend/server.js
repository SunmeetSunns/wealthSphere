const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const portfolioRoutes = require('./router/portfolioRoutes');
const userRoute = require('./router/user');
const Counter = require('./models/counter'); // Import the Counter model
const { connectDB } = require('./db'); // Import the connectDB function
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { verifyUser } = require('./middleware/auth');

const app = express();

const allowedOrigins = ['https://deft-starship-250f12.netlify.app', 'http://localhost:4200'];

app.use(cors({
  origin: '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials:true
}));


app.use(bodyParser.json());
app.use(cookieParser());

// Environment variables
const port = process.env.PORT || 5000;

// Routes
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
(async () => {
  try {
    await connectDB(); // Connect to MongoDB
    await initCounter(); // Initialize the counter
    console.log('Database connected and counter initialized.');
  } catch (err) {
    console.error('Error during initialization:', err);
    process.exit(1); // Exit if there's an error
  }
})();

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
