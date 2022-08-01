const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    postImg: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    createdAt: {
        type: Date,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }],
    comments: [
        {
            commentedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: true
            },
            comment: {
                type: String,
            },
        }
    ],
})

module.exports = PostModel = mongoose.model('post', postSchema);