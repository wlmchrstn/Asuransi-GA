const mongoose = require('mongoose')

const saldoSchema = new mongoose.Schema({
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    value: {
        type: Number,
        required: true
    },
    image:{
        type: String,
        required: false
    },
    isDone:{
        type: Boolean,
        default: false
    }
})

var Saldo = mongoose.model('Saldo', saldoSchema)
module.exports = Saldo;
