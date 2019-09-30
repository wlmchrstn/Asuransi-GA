const mongoose = require('mongoose');
require('mongoose-type-email');

const formSchema = new mongoose.Schema({
    insurances: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Insurance'
    },
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        uppercase: true
    },
    NIK: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['MALE', 'FEMALE']
    },
    birthDate: {
        type: Number,
        required: true,
        min: 1,
        max: 31
    },
    birthMonth: {
        type: String,
        required: true,
        enum: ['JANUARY','FEBRUARY','MARCH','APRIL','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER']
    },
    birthYear: {
        type: Number,
        required: true,
        min: 1901,
        max: 2019
    },
    birthPlace: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Single', 'Married', 'Other']
    },
    phone: {
        type: String,
        required: true
    },
    NPWP: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: true
    },
    postalCode: {
        type: Number,
        required: true,
        minlength: 5,
        maxlength: 5   
    },
    familyCardNumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: false
    }
})

var Form = mongoose.model('Form', formSchema);
module.exports = Form;
