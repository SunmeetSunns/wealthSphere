const Stock = require('../models/stocks');
const FD = require('../models/fd');
const Cash = require('../models/cash');
const Crypto = require('../models/cryptoCurrency');
const Account = require('../models/bankAccount');
const { getDB } = require('../db')
// const db=getDB();


exports.addStock = async (req, res) => {
  try {

    const stockNew = req.body;
    const response = await Stock.create(stockNew); // Stock.create expects an object, not an instance of Stock

    // Send back the created stock entry
    res.status(200).json({
      success: true,
      data: response,
      message: 'Stock entry created successfully'
    });
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(400).json({ error: error.message });
  }
};
exports.getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).json(stocks);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching stocks' });
  }
};
exports.updateStock = async (req, res) => {
  try {
    const { orderId } = req.body;
    const updatedData = { ...req.body };
    delete updatedData.orderId;
    const updatedStock = await Stock.findOneAndUpdate(
      { orderId: orderId },
      updatedData,
      { new: true }
    );
    if (!updatedStock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found for the given orderId',
      });
    }
    res.status(200).json({
      success: true,
      data: updatedStock,
      message: 'Stock updated successfully',
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(400).json({ error: 'Error updating stock' });
  }
};
exports.deleteStock = async (req, res) => {
  try {
    const { orderId } = req.body;
    const deletedStock = await Stock.findOneAndDelete({ orderId: orderId });
    if (!deletedStock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found for the given orderId',
      });
    }
    res.status(200).json({
      success: true,
      data: deletedStock,
      message: 'Stock deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(400).json({ error: 'Error deleting stock' });
  }
};

exports.calculateStockRisk=async(req,res)=>{
  try{
    const stock=await Stock.find()
    
  }
  catch(err){

  }
}
// FD CRUD
exports.addFD = async (req, res) => {
  try {
    const fd = req.body;
    await FD.create(fd);
    res.status(201).json(fd);
  } catch (error) {
    res.status(400).json({ error: 'Error adding FD' });
  }
};

exports.getFDs = async (req, res) => {
  try {
    const fds = await FD.find();
    res.status(200).json(fds);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching FDs' });
  }
};
exports.updateFd = async (req, res) => {
  try {
    const {orderId} = req.body;
    const updatedData = { ...req.body };
    delete updatedData.orderId;
    const updateFD = await FD.findOneAndUpdate(
      { orderId: orderId },
      updatedData,
      { new: true }
    );
    if (!updatedFD) {
      return res.status(404).json({
        success: false,
        message: 'FD not found with given orderID',
      });
    }
    res.status(200).json({
      success: true,
      data: updatedFD,
      message: 'FD update Successfully',
    })
  }
  catch (err) {
    console.error(err)
  }
}

exports.deleteFD = async (req, res) => {
  try {
    const {orderId} = req.body;
    const deletedFd = await FD.findOneAndDelete({ orderId: orderId });
    if (!deletedFd) {
      return res.status(404).json({
        success: false,
        message: 'FD not found with given orderId',
      })
    }
    res.status(200).json({
      success: true,
      data: deletedFd,
      message: 'Fd deleted successfully',

    })
  }
  catch (err) {
    console.log(err)
  }
}
// Cash CRUD


exports.addCash = async (req, res) => {
  // Mapping of currencies to their corresponding SVG file paths
  const currencySvgMap = {
    INR: '/assets/flags/india.svg',
    USD: '/assets/flags/usa.svg',
    EUR: '/assets/flags/cad.svg',
    GBP: '/assets/flags/uk.svg',
    CAD: '/assets/flags/canada.svg',
  };

  const symbolMap = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: '$',
  };

  try {
    const cash = req.body;

    // Fetch live exchange rates for conversion
    const ratesResponse = await axios.get('https://v6.exchangerate-api.com/v6/26fd075a3f2ec6e2bdfe8786/latest/INR');
    const rates = ratesResponse.data.conversion_rates;

    // Convert the amount to INR if currency is not INR
    if (cash.currency && rates[cash.currency]) {
      const exchangeRate = 1/rates[cash.currency];
      cash.amountinINR = cash.amount * exchangeRate;
      cash.exchangeRate=exchangeRate
      // Convert amount to INR
    } else {
      cash.amountinINR = cash.amount; // Assume the amount is already in INR if currency is not found
    }

    // Add the corresponding SVG URL based on the currency received in the request
    if (cash.currency && currencySvgMap[cash.currency]) {
      cash.svg_url = currencySvgMap[cash.currency];
    } else {
      // Fallback if the currency is not in the map
      cash.svg_url = '/assets/flags/default.svg';
    }

    // Add the currency symbol
    if (cash.currency && symbolMap[cash.currency]) {
      cash.symbol = symbolMap[cash.currency];
    }

    // Create the cash entry in the database
    await Cash.create(cash);

    // Send the response with the svg_url included
    res.status(201).json(cash);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error adding cash' });
  }
};


exports.getCash = async (req, res) => {
  try {
    const cash = await Cash.find();
    res.status(200).json(cash);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching cash' });
  }
};

exports.updateCash = async (req, res) => {
  try {
    const {orderId} = req.body;
    const updatedData = { ...req, body };
    delete updatedData.orderId;
    const updatedCash = await Cash.findOneAndUpdate(
      { orderId: orderId },
      updatedData,
      { new: true }
    )
    if (!updatedCash) {
      return res.status(404).json({
        success: false,
        message: 'Cash details not found with given orderId',
      })
    }
    res.status(200).json({
      success: true,
      data: updatedCash,
      message: 'Cash updated successfully',
    })
  }
  catch (err) {
    console.log(err)
  }
}
exports.deleteCash = async (req, res) => {
  try {
    const{orderId}  = req.body;
    const deletedCash = await Cash.findOneAndDelete({ orderId: orderId });
    if (!deletedCash) {
      return res.status(404).json({
        success: false,
        message: 'Cash details not found with given orderId',
      })
    }
    res.status(200).json({
      success: true,
      data: this.deleteCash,
      message: 'Cash details deleted successfully'

    })
  }
  catch (err) {
    console.error(err)
  }
}
// Crypto CRUD
exports.addCrypto = async (req, res) => {
  try {
    const crypto = req.body;
    await Crypto.create(crypto);
    res.status(201).json(crypto);
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Error adding crypto' });
  }
};

exports.getCrypto = async (req, res) => {
  try {
    const crypto = await Crypto.find();
    res.status(200).json(crypto);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching crypto' });
  }
};

exports.updateCrypto= async (req, res) => {
  try {
    const {orderId}  = req.body;
    const updatedData = { ...req.body };
    delete updatedData.orderId;
    const updatedCrypto = await Cash.findOneAndUpdate(
      { orderId: orderId },
      updatedData,
      { new: true }
    )
    if (!updatedCrypto) {
      return res.status(404).json({
        success: false,
        message: 'Crypto details not found with given orderId',
      })
    }
    res.status(200).json({
      success: true,
      data: updatedCrypto,
      message: 'Crypto updated successfully',
    })
  }
  catch (err) {
    console.log(err)
  }
}
exports.deleteCrypto = async (req, res) => {
  try {
    const {orderId}  = req.body;
    const deletedCash = await Crypto.findOneAndDelete({ orderId: orderId });
    if (!deletedCash) {
      return res.status(404).json({
        success: false,
        message: 'Crypto details not found with given orderId',
      })
    }
    res.status(200).json({
      success: true,
      data: this.deleteCash,
      message: 'Crypto details deleted successfully'

    })
  }
  catch (err) {
    console.error(err)
  }
}
// Foreign Currency CRUD


exports.fetchFDRates = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('fdRates');
    const fdRates = await collection.find().toArray();
    res.status(200).json(fdRates)
  }
  catch (err) {
    console.log(err)
  }
}
exports.calculatePortfolio = async (req, res) => {
  try {
    const stocks = await Stock.find();
    const fds = await FD.find();
    const cash = await Cash.find();
    const cryptos = await Crypto.find();

    // Calculate total values
    const stockValue = stocks.reduce((acc, stock) => acc + stock.totalValue, 0);
    const fdValue = fds.reduce((acc, fd) => acc + fd.depositAmount, 0);
    const cashValue = cash.reduce((acc, cashItem) => acc + cashItem.amountinINR, 0); // Assuming cash has an 'amount' field
    const cryptoValue = cryptos.reduce((acc, crypto) => acc + crypto.currentValue, 0);

    const totalValue = stockValue + fdValue + cashValue + cryptoValue;

    // Calculate percentages
    const stockPercentage = (stockValue / totalValue) * 100;
    const fdPercentage = (fdValue / totalValue) * 100;
    const cashPercentage = (cashValue / totalValue) * 100;
    const cryptoPercentage = (cryptoValue / totalValue) * 100;


    res.status(200).json({
      totalValue,
      percentages: {
        stock: stockPercentage,
        fd: fdPercentage,
        cash: cashPercentage,
        crypto: cryptoPercentage,

      },
      assetValues: {
        stockTotal: stockValue,
        fdTotal: fdValue,
        cashTotal: cashValue,
        cryptoTotal: cryptoValue
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'Error calculating portfolio' });
  }
};
const axios = require('axios');

require('dotenv').config();
exports.getNewsSentiment = async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY; // Ensure this is set in your .env file
    const tickers = 'AAPL'; // Replace or pass this dynamically as needed
    const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${tickers}&apikey=${apiKey}`;

    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Node.js' }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching news sentiment:', error);
    res.status(500).json({ error: 'Error fetching news sentiment' });
  }
};

exports.getGainers = async (req, res) => {
  try {
    const apiKey = process.env.ALPHA_KEY; // Make sure this is set in your .env file
    const url = `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${apiKey}`;

    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Node.js' }
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error('Error fetching top gainers:', err);
    res.status(500).json({ error: 'Error fetching top gainers' });
  }
};


exports.getExchangeRates = async (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://v6.exchangerate-api.com/v6/26fd075a3f2ec6e2bdfe8786/latest/INR',
  };
  const currencySvgMap = {
    INR: '/assets/flags/india.svg',
    USD: '/assets/flags/usa.svg',
    EUR: '/assets/flags/cad.svg',
    GBP: '/assets/flags/uk.svg',
    CAD: '/assets/flags/canada.svg',
  };

  try {
    const response = await axios.request(options);
    const rates = response.data.conversion_rates;

    // Filter the required currencies
    const requiredCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'CAD'];
    const filteredRates = requiredCurrencies.map(currency => ({
      currency: currency,
      exchange_rate: rates[currency],
      actual_price: 1 / rates[currency],
      svg_url: currencySvgMap[currency]
    }));

    console.log(filteredRates);
    res.json(filteredRates); // Send the filtered data back to the client
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
};


exports.AddAccount = async (req, res) => {
  try {
    const account = req.body;
    await Account.create(account);
    res.status(201).json(account);
  }
  catch (err) {
    res.status(400).json({ error: 'Error adding Account' });
  }

}

exports.getCryptoRates = async (req, res) => {
  try {
    const response = await axios.get('https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CRYPTO_KEY, // Use your API key here
      },
    });

    const cryptos = response.data.data;  // Array of cryptocurrency data

    // Transform the data as per your requirement
    const transformedCryptos = cryptos.map((crypto) => {

      return {
        symbol: crypto.symbol, // Using the name of the cryptocurrency
        cmc_rank: crypto.cmc_rank || 0, // Circulating supply
        circulating_supply: crypto.circulating_supply,  // Current price from API
        total_supply: crypto.total_supply,
        max_supply: crypto.max_supply,
        updationDate: crypto.last_updated,  // Date added

      };
    });

    // Send the transformed data as a response
    res.status(200).json({
      status: {
        timestamp: new Date().toISOString(),
        error_code: 0,
        error_message: null,
        elapsed: response.data.status.elapsed,
        credit_count: response.data.status.credit_count,
        notice: response.data.status.notice,
        version: response.data.status.version
      },
      data: transformedCryptos
    });
  } catch (error) {
    res.status(500).json({
      status: {
        timestamp: new Date().toISOString(),
        error_code: 500,
        error_message: error.message,
        elapsed: 0,
        credit_count: 0,
        notice: null,
        version: 'V2.0.1'
      },
      data: []
    });
  }
};


