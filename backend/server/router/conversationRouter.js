const route = require('express').Router();
const {conversation, getConversations} = require('../controller/conversationController');

route.post('/', conversation);
route.get('/:id', getConversations);

module.exports = route;