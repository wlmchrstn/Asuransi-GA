const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
require('mongoose-type-email');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    image: {
        type: String,
        default: '/home/ayumhrn/project/backend/public/images/profpict.png'
    },
    birthPlace: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    role: {
        type: String,
        enum: ['Super_Admin', 'Admin', 'User'],
        default: 'User'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        required: false
    },
    expToken: {
        type: Date,
        required: false
    }
})

userSchema.plugin(uniqueValidator)
var User = mongoose.model('User', userSchema)

module.exports = User;
