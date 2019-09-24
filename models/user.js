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
        type: mongoose.SchemaType.Email,
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
        type: Number,
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
        required: false
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
        enum: ['Admin', 'User'],
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        required: false
    }
})

userSchema.plugin(uniqueValidator)
var User = mongoose.model('User', userSchema)

module.exports = User;
