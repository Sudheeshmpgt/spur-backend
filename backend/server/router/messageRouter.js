const route = require('express').Router();
const {messages, getMessages} = require('../controller/messageController')

route.post('/', messages);
route.get('/:id', getMessages);

module.exports = route;