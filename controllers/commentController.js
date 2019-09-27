const Comment = require('../models/comment.js');
const { success, error } = require('../helpers/response.js');
const Insurance = require('../models/insurance')

module.exports= {
    async addComment(req, res) {
        let insurance = await Insurance.findById(req.params.insurance)
        if (!insurance) {return res.status(404).json(error('Insurance not found!', insurance, 404))}
        Comment.create({
            users: req.decoded._id,
            insurances: req.params.insurance,
            comment: req.body.comment,
            rating: req.body.rating
        })
            .then(result => {
                res.status(201).json(success('Comment posted!', result))
            })
            .catch(err => {
                res.status(422).json(error('Failed to post comment!', err, 422))
            })
    },
    editComment(req, res) {
        let update = { new: true }
        Comment.findByIdAndUpdate(req.params.comment, req.body, update)
            .then(result => {
                res.status(200).json(success('Comment updated!', result))
            })
            .catch(err => {
                res.status(422).json(error('Failed to update comment!', err, 422))
            })
    },
    deleteComment(req, res) {
        Comment.findByIdAndDelete(req.params.comment)
            .then(result => {
                res.status(200).json(success('Comment deleted!', result))
            })
            .catch(err => {
                res.status(422).json(error('Failed to delete comment!', err, 422))
            })
    },
    getAllComment(req, res) {
        Comment.findOne({insurances: req.params.insurance})
            .then(result => {
                res.status(200).json(success('Here is the comment!', result))
            })
    }
}