const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    isPaid:Boolean,
    amount:Number,
    razorpay:{
        orderId:String,
        paymentId:String,
        signature:String
    }
})

module.exports = PaymentModel = mongoose.model('payment', paymentSchema);