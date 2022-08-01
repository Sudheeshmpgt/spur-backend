const route = require('express').Router()
const {getWalletBalance, setWalletBalance} = require('../controller/walletController');
const verifyAuth = require('../middleware/authenticate')

route.get('/:id', verifyAuth, getWalletBalance)   
route.post('/:id',verifyAuth, setWalletBalance)

module.exports = route 