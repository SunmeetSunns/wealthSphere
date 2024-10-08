const express=require('express');
const router=express.Router();
const { addStock, getStocks, addFD, getFDs, addCash, getCash, addCrypto, getCrypto,calculatePortfolio,getNewsSentiment, AddAccount, getGainers, updateStock, deleteStock, getExchangeRates, getCryptoRates, fetchFDRates, updateFd, deleteFD, updateCash,deleteCash, updateCrypto, deleteCrypto} = require('../controller/portfolioController');


// Stock
router.get('/getstock',getStocks)
router.post('/putstock',addStock)
router.post('/updateStock',updateStock)
router.post('/deleteStock',deleteStock)

router.post('/addfd', addFD);
router.get('/getfd', getFDs);
router.post('/deletefd',deleteFD)
router.post('/updatefd',updateFd)

// Cash routes
router.post('/putcash', addCash);
router.get('/getcash', getCash);
router.post('/updateCash',updateCash)
router.post('/deleteCash',deleteCash)
// Crypto routes
router.post('/putcrypto', addCrypto);
router.get('/getcrypto', getCrypto);
router.post('/updateCrypto',updateCrypto);
router.post('/deleteCrypto',deleteCrypto)

// Calculate portfolio

router.get('/portfolioTotal',calculatePortfolio)

// News Api

router.get('/fetchNews',getNewsSentiment)

// Account Routes

router.post('/postAcc',AddAccount)

// Stock top gainers and lossers

router.get('/getGainers',getGainers)

// get exchange rates

router.get('/exchangeRates',getExchangeRates)

// get getCryptoRates
router.get('/cryptoRates',getCryptoRates)
// fetch fd rates

router.get('/fdRates',fetchFDRates)


module.exports=router;