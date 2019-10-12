const mongoose = require('mongoose');

const insuranceSchema = mongoose.Schema({
    name_insurance: {
        type: String,
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
    benefit: {
        type: String
    },
    currency: {
        type: String,
        default: "IDR"
    }
})

var insurance = mongoose.model('insurance', insuranceSchema)

module.exports = insurance
