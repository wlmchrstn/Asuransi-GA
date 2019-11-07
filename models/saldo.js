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
    isVerified:{
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    }
}, {
    timestamps: true
})

var Saldo = mongoose.model('Saldo', saldoSchema)
module.exports = Saldo;
