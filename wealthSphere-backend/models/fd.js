const mongoose = require('mongoose');
const Counter = require('./counter');

const fdSchema = new mongoose.Schema({
  username: { type: String, required: true },
  bankName: { type: String, required: true },
  depositAmount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  tenure: { type: Number, required: true },
  maturityDate: { type: Date, required: true },
  beginningDate: { type: Date, required: true },
  orderId: { type: Number, unique: true },
  expectedReturn: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

fdSchema.pre('save', async function (next) {
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
module.exports = mongoose.model('FD', fdSchema);
