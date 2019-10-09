const mongoose = require('mongoose');

const insuranceSchema = mongoose.Schema({
    name_insurance: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['kesehatan', 'proteksi Jiwa', 'penyakit', 'tabungan'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    premi: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isPromo: {
        type: Boolean
    },
    time_insurance: {
        type: String,
        required: true
    },
    range_age: {
        type: String,
        required: true
    },
    max_person: {
        type: String,
        required: true
    } 
})

var insurance = mongoose.model('insurance', insuranceSchema)

module.exports = insurance
