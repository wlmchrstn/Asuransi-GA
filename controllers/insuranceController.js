var mongoose = require('mongoose');
var insurance = require('../models/insurance');
var { success, error } = require('../helpers/response');
var multer = require('multer');
var cloudinary = require('cloudinary');
var datauri = require('datauri');
var uploader = multer().single('image');

exports.createInsurance = async (req, res) => {

    var {
        title, description, image, price, isPromo
    } = req.body

    var newInsurance = new insurance({
        title, description, image, price, isPromo
    })

    newInsurance.save()
        .then(() => {
            return res.status(201).json(
                success('Insurance has been add!', newInsurance)
            )
        })
        .catch((err) => {
            return res.status(406).json(
                error('Failed', err.message, 406)
            )
        })
}

exports.ShowAllInsurance = async (req, res) => {

    insurance.find()
        .select('-__v')
        .then((insurance) => {
            return res.status(200).json(
                success('All Insurance', insurance)
            )
        })
}

exports.ShowOneInsurance = async (req, res) => {

    let insuranceExist = await insurance.findById({_id: req.params.id})

    if (!insuranceExist) {
        return res.status(404).json(
            error('Not Found', "", 404)
        )
    }

    insurance.findById({ _id: req.params.id })
        .select('-__v')
        .then((insurance) => {
            return res.status(200).json(
                success('Insurance: ', insurance)
            )
        })
}

exports.updateInsurance = async (req, res) => {

    insurance.findByIdAndUpdate({ _id: req.params.id },
        { $set: req.body }, { new: true })
        .then((insurance) => {
            return res.status(201).json(
                success('Successfully updated!', insurance)
            )
        })
        .catch(err => {
            res.status(406).json(
                error('Update Insurance Failed', err.message, 406)
            )
        })
}

exports.deleteInsurance = async (req, res) => {

    let insuranceExist = await insurance.findById({_id: req.params.id})

    if (!insuranceExist) {
        return res.status(404).json(
            error('Not Found', "", 404)
        )
    }

    insurance.findOneAndRemove({ _id: req.params.id })
        .then((insurance) => {
            return res.status(200).json(
                success('Successfully deleted!', insurance)
            )
        })

}

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
                insurance.findByIdAndUpdate({ _id: req.params.id },
                    { $set: { image: data.secure_url } },
                    { new: true })
                    .then((insurance) => {
                        return res.status(201).json(
                            success('Updated!', insurance)
                        )
                    })
            })
            .catch(err => {
                /* istanbul ignore next */
                res.send(err);
            })
    })

}

exports.Search = async (req, res) => {
    insurance.find(req.query)
        .then(result => {
            return res.status(200).json(success('Here is the result!', result))

        })
}
