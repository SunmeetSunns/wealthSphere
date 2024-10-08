const mongoose = require('mongoose');
const Counter = require('./counter'); // Import the counter schema

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  company: { type: String, required: true },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  totalValue: { type: Number, required: true },
  orderId: { type: Number, unique: true }, // Ensure orderId is unique
  date: { type: Date, default: Date.now }
});

// Middleware to auto-increment orderId before saving
stockSchema.pre('save', async function(next) {
  let doc = this;
  
  // Find and increment the counter for orderId
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'orderId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true } // Create the document if it doesn't exist
    );

    // Assign the new sequence value to orderId
    doc.orderId = counter.seq;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Stock', stockSchema);
