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
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['MALE', 'FEMALE']
    },
    birthDate: {
        type: Date,
        required: true
    },
    birthPlace: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    NPWP: {
        type: String,
        default: '-'
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postalCode: {
        type: Number,
        required: true
    },
    No_KK: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    job: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    status_pembayaran: {
        type: String,
        enum: ['active', 'pending', 'inactive'],
        default: 'pending'
    },
    tanggal_pembayaran: {
        type: Date
    }
})

var Form = mongoose.model('Form', formSchema);
module.exports = Form;
