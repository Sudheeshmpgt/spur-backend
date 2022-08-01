const route = require('express').Router();
const {getRazorpayKey, createOrder, payOrder, listOrder} = require("../controller/razorpayController") 

//razorpay get key
route.get('/get_key', getRazorpayKey)

//razorpay create order
route.post('/create_order', createOrder)

//razorpay pay order
route.post('/pay_order', payOrder)

//razoypay list orders
route.get('/list_orders', listOrder)

module.exports = route;