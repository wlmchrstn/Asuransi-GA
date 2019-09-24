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
    guaranteeNumber: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    policy: {
        type: String,
        required: true
    }
})

var Insurance = mongoose.model('Insurance', insuranceSchema)

module.exports = Insurance
