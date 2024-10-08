const mongoose=require('mongoose');

const portfolioSchema=new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to the user
    totalValue: { type: Number, default: 0 }, // Total value of all assets
    stockValue: { type: Number, default: 0 }, // Total value of stocks
    fdValue: { type: Number, default: 0 }, // Total value of fixed deposits
    cashValue: { type: Number, default: 0 }, // Total value of cash
    cryptoValue: { type: Number, default: 0 }, // Total value of cryptocurrency
    updatedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Portfolio', portfolioSchema);