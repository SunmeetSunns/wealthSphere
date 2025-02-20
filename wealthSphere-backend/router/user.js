// Yha sare login and signup k routes h 

const express=require('express')
const {signUp,login, findAccountData, AddAccount, checkUserAccount, calculatePortfolioWebhook}=require('../controller/user')


const router=express.Router();


router.post('/signUp',signUp)
router.post('/login',login)
router.post('/accountInfo',findAccountData)
router.post('/setUpAccount',AddAccount)
router.post('/userDetailsExist',checkUserAccount)
router.post('/webhookPortfolio',calculatePortfolioWebhook)
module.exports=router;