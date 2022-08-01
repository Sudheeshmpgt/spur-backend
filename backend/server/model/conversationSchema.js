const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    members:{
        type: Array,
    },
}, { timestamps: true });

module.exports = ConversationModel = mongoose.model('conversation', conversationSchema);
