const Comment = require('../models/comment.js');
const { success, error } = require('../helpers/response.js');
const Insurance = require('../models/insurance');
const Form = require('../models/formInsurance');
module.exports= {
    async addComment(req, res) {
        let form = await Form.findById(req.params.form)
        if((form.status_pembayaran === 'pending') || (form.status_pembayaran === 'inactive') || (form.status_pembayaran === 'rejected')){
            return res.status(403).json(error('You are not allowed to give review. Either your form is rejected or buy the insurance first!', '-', 400))
        }
        else if(form.isReviewed === true){
            return res.status(409).json(error('You already reviewed this insurance', '-', 409))
        }else {
            Comment.create({
                users: req.decoded._id,
                insurances: form.insurances,
                comment: req.body.comment,
                rating: req.body.rating
                })
                .then(result => {
                    form.isReviewed = true
                    form.save()
                    res.status(201).json(success('Comment posted!', result))
                })
                .catch(err => {
                    res.status(422).json(error('Failed to post comment!', err, 422))
                })
        }
    },
    async editComment(req, res) {
        let isValid = await Comment.findById(req.params.comment)
        if (!isValid) return res.status(404).json(error('Comment not found!', '-', 404))
        let update = { new: true }
        Comment.findByIdAndUpdate(req.params.comment, req.body, update)
            .then(result => {
                res.status(200).json(success('Comment updated!', result))
            })
            .catch(err => {
                res.status(422).json(error('Failed to update comment!', err, 422))
            })
    },
    async deleteComment(req, res) {
        let isValid = await Comment.findById(req.params.comment)
        if (!isValid) return res.status(404).json(error('Comment not found!', '-', 404))
        Comment.findByIdAndDelete(req.params.comment)
            .then(result => {
                res.status(200).json(success('Comment deleted!'))
            })
    },
    getAllComment(req, res) {
        Comment.find({insurances: req.params.insurance})
            .then(result => {
                res.status(200).json(success('Here is the comment!', result))
            })
    },
    showAll(req, res) {
        Comment.find()
            .populate('users', 'name address')
            .select('-__v')
            .then(result => {
                res.status(200).json(success('Show all comment!', result))
            })
    }
}
