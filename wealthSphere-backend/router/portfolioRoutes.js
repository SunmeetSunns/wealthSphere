const express=require('express');
const router=express.Router();
const { addStock, getStocks, addFD, getFDs, addCash, getCash, addCrypto, getCrypto,calculatePortfolio,getNewsSentiment, getGainers, updateStock, deleteStock, getExchangeRates, getCryptoRates, fetchFDRates, updateFd, deleteFD, updateCash,deleteCash, updateCrypto, deleteCrypto} = require('../controller/portfolioController');
const { getAllCryptoRiskAssessment, getAllStockRiskAssessment, getCashSummary, getMaturitySchedule, getMaturityScheduleByBank } = require('../controller/portfolioReports');


// Stock
router.post('/getstock',getStocks)
router.post('/putstock',addStock)
router.post('/updateStock',updateStock)
router.post('/deleteStock',deleteStock)

router.post('/addfd', addFD);
router.post('/getfd', getFDs);
router.post('/deletefd',deleteFD)
router.post('/updatefd',updateFd)

// Cash routes
router.post('/putcash', addCash);
router.post('/getcash', getCash);
router.post('/updateCash',updateCash)
router.post('/deleteCash',deleteCash)
// Crypto routes
router.post('/putcrypto', addCrypto);
router.post('/getcrypto', getCrypto);
router.post('/updateCrypto',updateCrypto);
router.post('/deleteCrypto',deleteCrypto)

// Calculate portfolio

router.post('/portfolioTotal',calculatePortfolio)

// News Api

router.get('/fetchNews',getNewsSentiment)

// Account Routes


// Stock top gainers and lossers

router.get('/getGainers',getGainers)

// get exchange rates

router.get('/exchangeRates',getExchangeRates)

// get getCryptoRates
router.get('/cryptoRates',getCryptoRates)
// fetch fd rates

router.get('/fdRates',fetchFDRates)
router.get('/cryptoRiskAssessment',getAllCryptoRiskAssessment)
router.get('/stockRiskAssessment', getAllStockRiskAssessment)
router.get('/getCashReport',getCashSummary)
router.get('/getfdReport',getMaturityScheduleByBank)
router.get('/signup',(req,res)=>{
    return res.render('signup')
})
module.exports=router;