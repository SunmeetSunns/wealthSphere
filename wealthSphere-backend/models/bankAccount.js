const mongoose=require('mongoose');

const Account=new mongoose.Schema({
    accountNo:{
        type:Number,required:true,
    },
    account_name:{
        type:String,required:true,
    },
    primary_acc:{
        type:Boolean,required:true,
    },
    email:{
        type:String,required:true,
    },
    pan_no:{
        type:String,required:true,
    },
    aadhar_no:{
        type:Number,required:true,
    },
    createdAt:{
        type:Date,default:Date.now()
    }
})

module.exports=mongoose.model('Account',Account)