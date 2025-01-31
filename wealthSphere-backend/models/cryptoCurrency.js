const mongoose = require('mongoose');
const Counter = require('./counter');

const cryptoSchema = new mongoose.Schema({
  type: {type:String,required:true},
  username:{type:String,required:true},
  quantity: {type:Number,required:true},
  purchasePrice: {type:Number,required:true},
  currentValue: {type:Number,required:true},
  purchaseDate:{type:Date,required:true},
  totalValue:{type:Number,required:true},
  orderId: { type: Number, unique: true },
  date: { type: Date, default: Date.now }
});

cryptoSchema.pre('save', async function(next) {
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

module.exports = mongoose.model('Crypto', cryptoSchema);
