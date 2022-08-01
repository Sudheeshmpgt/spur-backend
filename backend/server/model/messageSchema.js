const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId:{
        type: String,
    },
    sender:{
        type: String,
    },
    text:{
        type: String,
    }
}, { timestamps: true });

module.exports = MessageModel = mongoose.model('message', messageSchema);
