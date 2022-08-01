const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    about: {
        type: String,
        default: ''
    },
    interviewer: {
        type: Boolean
    },
    profileImg: {
        type: String
    },
    experience: {
        type: Number,
        default: 0
    },
    connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }],
    block: {
        type: Boolean,
        default: false
    },
})

// userSchema.methods.generateAuthToken = async function() {
//     try {
//         let token = jwt.sign({_id:this._id, role:'user'}, process.env.SECRET_KEY);
//         return token;
//     } catch (error) {
//         console.log(error);
//     }
// }

module.exports = UserModel = mongoose.model('user', userSchema);

