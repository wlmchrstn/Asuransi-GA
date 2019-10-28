const mongoose = require('mongoose');
require('mongoose-type-email');

const formSchema = new mongoose.Schema({
    insurances: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'insurance'
    },
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    NIK: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female']
    },
    birthDate: {
        type: Date,
        required: true
    },
    birthPlace: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    blood_type: {
        type: String,
        enum: ['A', 'B', 'AB', 'O'],
        uppercase: true,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Single', 'Married']
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
    penyakit_sekarang: {
        type: String,
        required: true
    },
    penyakit_dulu: {
        type: String
    },
    status_pembayaran: {
        type: String,
        enum: ['active', 'pending', 'inactive', 'reject'],
        default: 'pending'
    },
    tanggal_pembayaran: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    }
})

var Form = mongoose.model('Form', formSchema);
module.exports = Form;
