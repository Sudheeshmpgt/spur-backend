const mongoose= require('mongoose')
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

module.exports = AdminModel = mongoose.model('Admin', adminSchema);  