const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique:true
    },
    first_name: {
        type: String,
        required: true,
       
    },
    last_name: {
        type: String,
        required: true,

    },
    mobile_no: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

const User = mongoose.model('user', userSchema)

module.exports = User

