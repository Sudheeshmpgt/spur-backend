const route = require('express').Router()
const {interviewerRevenue, adminRevenue} = require('../controller/chartController');
const verifyAuth = require('../middleware/authenticate')

route.get('/interviewer/:id',verifyAuth, interviewerRevenue) 

route.get('/admin',verifyAuth, adminRevenue )

module.exports = route;