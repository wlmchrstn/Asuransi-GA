const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    insurances: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Insurance'
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        enum:[1,2,3,4,5]
    }
})

var Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment;
