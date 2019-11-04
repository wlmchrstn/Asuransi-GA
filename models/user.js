const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const validate = require('mongoose-validate')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        validate: [validate.alphanumeric, 'Username can only be alphanumeric!'],
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        validate: [validate.email, 'Invalid E-mail type!'],
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
        required: false
    },
    address: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: false
    },
    image: {
        type: String,
        default: 'https://res.cloudinary.com/ayumhrn/image/upload/v1569487841/fo1jogrqffevwvulwkyo.png'
    },
    birthPlace: {
        type: String,
        required: false
    },
    birthDate: {
        type: Date,
        required: false
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
    },
    saldo: {
        type: Number,
        default: 0
    }
})

userSchema.plugin(uniqueValidator)
var User = mongoose.model('User', userSchema)

module.exports = User;
