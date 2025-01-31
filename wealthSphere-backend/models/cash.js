const mongoose = require('mongoose');
const Counter = require('./counter');

const cashSchema = new mongoose.Schema({
  username:{type:String,required:true},
  source: {type:String,required:true},
  amount: {type:Number,required:true},
  currency:{type:String,required:true},
  svg_url:{type:String},
  symbol:{type:String},
  amountinINR:{type:Number},
  orderId: { type: Number, unique: true },
  exchangeRate:{type:Number},
  date: { type: Date, default: Date.now }
});

cashSchema.pre('save', async function(next) {
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

module.exports = mongoose.model('Cash', cashSchema);
