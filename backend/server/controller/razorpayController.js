const Razorpay = require('razorpay')
const PaymentModel = require('../model/paymentSchema')
require('dotenv').config()

//razorpay setup
const getRazorpayKey = async (req, res) => {
    res.send({ key: process.env.RAZORPAY_KEY_ID })
}

//razorpay create order
const createOrder = async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const options = {
            amount: req.body.amount,
            currency: 'INR',
        }
        const order = await instance.orders.create(options)
        if (!order) return res.send({ message: 'some error occured' })
        res.send(order)
    } catch (error) {
        res.send(error)
    }
}

//razorpay pay order
const payOrder = async (req, res) => {
    try {
        const { amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body
        const newPayment = PaymentModel({
            isPaid: true,
            amount: amount,
            razorpay: {
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId,
                signature: razorpaySignature,
            },
        })
        await newPayment.save()
        res.send({ message: 'Payment was successful' })
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const listOrder = async (req, res) => {
    const orders = await PaymentModel.find()
    res.send(orders);
}

module.exports = { getRazorpayKey, createOrder, payOrder, listOrder};
