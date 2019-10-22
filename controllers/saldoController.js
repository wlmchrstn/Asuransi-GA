const Saldo = require('../models/saldo');
const { success, error } = require('../helpers/response');
const multer = require('multer');
const cloudinary = require('cloudinary');
const datauri = require('datauri');
const uploader = multer().single('image');

exports.uploadphoto = async (req, res) => {

    var fileUp = req.file

    /*  istanbul ignore if */
    if (!fileUp) {
        return res.status(415).send({
            success: false,
            message: 'No file received: Unsupported Media Type'
        })
    }

    const dUri = new datauri()

    uploader(req, res, err => {
        var file = dUri.format(`${req.file.originalname}-${Date.now()}`, req.file.buffer);
        cloudinary.uploader.upload(file.content)
            .then(data => {
            /* istanbul ignore next */
                Saldo.findByIdAndUpdate({ _id: req.params.id },
                    { $set: { image: data.secure_url } },
                    { new: true })
                    .then((saldo) => {
                        /* istanbul ignore next */
                        return res.status(201).json(
                            success('Updated!', saldo)
                        )
                    })
            })
            .catch(/* istanbul ignore next */err => {
                res.send(err);
            })
    })

}

exports.create = async (req, res) => {

    var price = req.body.price
    var user = req.decoded._id

    var newSaldo = new Saldo ({
        user, price 
    })

    newSaldo.save()
        .then(() => {
            return res.status(201).json(
                success('Request topup saldo success!', newSaldo)
            )
        })
        .catch((err)=>{
            return res.status(406).json(
                error('Failed request topup saldo', err.message, 406)
            )
        })
}

exports.showAll = async (req, res) => {

    Saldo.find()
        .select('-__v')
        .then((topup) => {
            return res.status(200).json(
                success('Show all request topup!', topup)
            )
        })
}

exports.select = async (req, res) => {

    Saldo.findById(req.params.id)
        .then((topup) => {
            return res.status(200).json(
                success('Show selected request topup!', topup)
            )
        })
        .catch((err)=>{
            return res.status(404).json(
                error('Invalid params.id', err.message, 404)
            )
        })
}

exports.accept = async (req, res) => {

    Saldo.findByIdAndUpdate(req.params.id, {isDone: true}, { new: true })
        .then((topup) => {
            return res.status(200).json(
                success('Request topup accepted!', topup)
            )
        })
        .catch((err)=>{
            return res.status(404).json(
                error('Invalid params.id', err.message, 404)
            )
        })
}

exports.delete = async (req, res) => {

    Saldo.findOneAndDelete(req.params.id)
        .then((topup) => {
            return res.status(200).json(
                success('Delete selected request topup!', topup)
            )
        })
        .catch((err)=>{
            return res.status(404).json(
                error('Invalid params.id', err.message, 404)
            )
        })
}