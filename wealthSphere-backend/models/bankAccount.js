const mongoose=require('mongoose');

const Account=new mongoose.Schema({
    accountNo:{
        type:Number,required:true,
    },
    account_name:{
        type:String,required:true,
    },
    // primary_acc:{
    //     type:Boolean,required:true,
    // },
    username:{
        type:String,required:true,
    },
    address:{
        type:String,required:true,
    },
    birth_date:{
        type:Date,required:true,
    },
    gender:{
        type:String,required:true,
    },
    pan_no:{
        type:String,required:true,
    },
    aadhar_no:{
        type:String,required:true,
    },
    createdAt:{
        type:Date,default:Date.now()
    }
})

module.exports=mongoose.model('Account',Account)