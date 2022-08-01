const route = require('express').Router();
const {adminLogin, adminRegister} = require('../controller/adminController')

route.post('/login', adminLogin);
route.post('/registration', adminRegister)

route.get('/manage/user', )

module.exports = route;