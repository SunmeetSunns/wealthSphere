const User = require('../models/users');
const Account = require('../models/bankAccount');
const { setUser } = require('../service/auth');
const bcrypt = require('bcrypt');
const Stock = require('../models/stocks');
const FD = require('../models/fd');
const Cash = require('../models/cash');
const Crypto = require('../models/cryptoCurrency');
// const { getDB } = require('../db')

exports.signUp = async (req, res) => {
    try {
        const { username, first_name, last_name, mobile_no, password } = req.body;

        // Ensure all required fields are provided
        if (!username || !first_name || !last_name || !mobile_no || !password) {
            return res.status(200).json({ message: 'All fields are required' });
        }

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(200).json({ message: 'Username already exists' ,success:false});
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = true;
        //Create a new user
        const user = await User.create({
            username,
            first_name,
            last_name,
            mobile_no,
            password: hashedPassword, // Save the hashed password
        });
        const token = setUser(user);
        res.status(201).json({
            message: 'User created successfully',
            token,
            newUser: newUser,
            success:true,
            user: {
                id: user._id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                mobile_no: user.mobile_no,
            }, // Exclude the password in the response
        });
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error
            return res.status(200).json({ message: 'Username already exists',success:false });
        }

        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Case-insensitive search for username
        const user = await User.findOne({
            username: new RegExp(`^${username}$`, 'i'), // Case-insensitive regex search
        });

        // Check if user exists
        if (!user) {
            return res.status(200).json({ message: 'Invalid username or password' ,success:false});
        }

        // Compare the hashed password with the entered password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(200).json({ message: 'Invalid username or password' ,success:false});
        }

        // Generate JWT with expiry
        const token = setUser(user);

        // Calculate expiry time in seconds
        const expiresIn = 3600; // 1 hour
        const expiryTimestamp = Math.floor(Date.now() / 1000) + expiresIn;

        res.status(200).json({
            token,
            expiresIn, // Send expiry time in seconds
            success: true,
            user: {
                id: user._id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                mobile_no: user.mobile_no,
            },
            message: 'Logged in successfully',
        });
    } catch (error) {
        console.error('Error during login:', error); // Log the error
        res.status(500).send('An error occurred. Please try again later.');
    }
};


exports.logout = async (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
    window.location.reload()
}

exports.findAccountData = async (req, res) => {
    const { username } = req.body;
    const accountDetails = await Account.findOne({
        username: new RegExp(`^${username}$`, 'i'), // Case-insensitive regex search
    });
    if (!accountDetails) {
        res.status(500).json({
            message: 'No account details found'
        })
    }
    else {
        res.status(200).json({
            success: true,
            accountDetails: accountDetails
        })
    }

}
exports.AddAccount = async (req, res) => {
    try {
        const account = req.body;
        await Account.create(account);
        res.status(201).json({
            success:true, 
        });
    }
    catch (err) {
        res.status(400).json({ error: 'Error adding Account' });
    }

}
exports.checkUserAccount=async(req,res)=>{
    try{
        const {username}=req.body;

        const user=await Account.findOne({username})
        if(!user){
           res.status(201).json({
               newUser:true,
               success:true,
           })
        }
        else{
           res.status(200).json({
            mesage:'User account exist'
           })
        }
    }
    catch(error){
        res.status(500).json('Internal Server error')
    }
  
}
exports.calculatePortfolioWebhook = async (req, res) => {
  try {
    const { username } = req.body; // Extract username from the request body

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required to calculate the portfolio',
      });
    }

    const accountDetails = await Account.findOne({
      username: new RegExp(`^${username}$`, 'i'), // Case-insensitive regex search
    });

    // If account details do not exist, return early without performing further actions
    if (!accountDetails) {
      return res.status(201).json({
        message: 'No account details found',
        newUser: true,
      });
    }

    // Fetch user-specific data only if accountDetails exist
    const [stocks, fds, cash, cryptos] = await Promise.all([
      Stock.find({ username }),
      FD.find({ username }),
      Cash.find({ username }),
      Crypto.find({ username }),
    ]);

    // Check if all assets are empty
    const newUser = stocks.length === 0 && fds.length === 0 && cash.length === 0 && cryptos.length === 0;

    // Handle case when user has no assets
    if (newUser) {
      return res.status(200).json({
        success: true,
        message: 'No assets found for the user. User seems to be new.',
        newUserWithNoFunds:true,
        totalValue: 0,
        percentages: {
          stock: 0,
          fd: 0,
          cash: 0,
          crypto: 0,
        },
        assetValues: {
          stockTotal: 0,
          fdTotal: 0,
          cashTotal: 0,
          cryptoTotal: 0,
        },
      });
    }

    // Calculate total values
    const stockValue = stocks.reduce((acc, stock) => acc + stock.totalValue, 0);
    const fdValue = fds.reduce((acc, fd) => acc + fd.depositAmount, 0);
    const cashValue = cash.reduce((acc, cashItem) => acc + cashItem.amountinINR, 0);
    const cryptoValue = cryptos.reduce((acc, crypto) => acc + crypto.totalValue, 0);

    const totalValue = stockValue + fdValue + cashValue + cryptoValue;

    // Calculate percentages
    const stockPercentage = (stockValue / totalValue) * 100;
    const fdPercentage = (fdValue / totalValue) * 100;
    const cashPercentage = (cashValue / totalValue) * 100;
    const cryptoPercentage = (cryptoValue / totalValue) * 100;

    return res.status(200).json({
      success: true,
      newUser: false, // User has some assets
      totalValue,
      percentages: {
        stock: stockPercentage.toFixed(2),
        fd: fdPercentage.toFixed(2),
        cash: cashPercentage.toFixed(2),
        crypto: cryptoPercentage.toFixed(2),
      },
      assetValues: {
        stockTotal: stockValue,
        fdTotal: fdValue,
        cashTotal: cashValue,
        cryptoTotal: cryptoValue,
      },
    });
  } catch (error) {
    console.error('Error calculating portfolio:', error);
    return res.status(500).json({ error: 'Error calculating portfolio' });
  }
};
