const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
    interviewerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    interviewId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'interview',
        required:true,
    }],
    walletBalance:{
        type: Number,
        default:0,
        required:true,
    } 
})

module.exports = WalletModel = mongoose.model('wallet', walletSchema);