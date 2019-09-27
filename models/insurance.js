const mongoose = require('mongoose');

const insuranceSchema = mongoose.Schema({
    title: {
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
    price: {
        type: Number,
        required: true
    },
    isPromo: {
        type: Boolean
    }
})

var insurance = mongoose.model('insurance', insuranceSchema)

module.exports = insurance