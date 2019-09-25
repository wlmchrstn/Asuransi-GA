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
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    policy: {
        type: String,
        required: true
    }
})

var insurance = mongoose.model('insurance', insuranceSchema)

module.exports = insurance