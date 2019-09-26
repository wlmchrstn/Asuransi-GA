const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    policy: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    }
})

var promo = mongoose.model('promo', promoSchema);
module.exports = promo;
