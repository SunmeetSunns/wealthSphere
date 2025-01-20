// Yha sare login and signup k routes h 

const express=require('express')
const {signUp,login}=require('../controller/user')


const router=express.Router();


router.post('/signUp',signUp)
router.post('/login',login)

module.exports=router;