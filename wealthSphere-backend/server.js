const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const portfolioRoutes = require('./router/portfolioRoutes');
const Counter = require('./models/counter'); // Import the Counter model
const { connectDB } = require('./db'); // Import the connectDB function
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

// Initialize routes
app.use('/api/portfolio', portfolioRoutes);

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
