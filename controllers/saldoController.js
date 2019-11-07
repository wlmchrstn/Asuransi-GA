const Saldo = require('../models/saldo');
const User = require('../models/user');
const { success, error } = require('../helpers/response');
const multer = require('multer');
const cloudinary = require('cloudinary');
const datauri = require('datauri');
const uploader = multer().single('image');
const funcHelper = require('../helpers/funcHelper');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

    var value = req.body.value
    var users = req.decoded._id

    let valid = await Saldo.findOne({ users: users, status: 'pending'})
    /* istanbul ignore else */
    if(valid) {
        return res.status(409).json(error('Failed to top-up, you still have pending request', '-', 409))
    }

    var newSaldo = new Saldo({
        users, value, 
        isVerified: false,
        status: 'pending'
    })

    newSaldo.save()
        .then(() => {
            return res.status(201).json(
                success('Request topup saldo success!', newSaldo)
            )
        })
        .catch((err) => {
            return res.status(406).json(
                error('Failed request topup saldo', err.message, 406)
            )
        })
}

exports.showAll = async (req, res) => {

    Saldo.find({isVerified: false, status: 'pending'})
        .populate('users', 'name')
        .select('-__v')
        .then((topup) => {
            return res.status(200).json(
                success('Show all request topup!', topup)
            )
        })
}

exports.showAllinUser = async (req, res) => {

    Saldo.findOne({ users: req.decoded._id, status: 'pending'})
        .select('-__v')
        .then((topup) => {
            return res.status(200).json(
                success('Show all request topup!', topup)
            )
        })
}

exports.showUserHistory = async (req, res) => {

    Saldo.find({ users: req.decoded._id, isVerified: true})
        .sort({createdAt: -1})
        .select('-__v')
        .then(result => {
            return res.status(200).json(success('Show all top up history!', result))
        })
}

exports.select = async (req, res) => {

    Saldo.findById(req.params.id)
        .then((topup) => {
            return res.status(200).json(
                success('Show selected request topup!', topup)
            )
        })
        .catch((err) => {
            return res.status(404).json(
                error('Invalid params.id', err.message, 404)
            )
        })
}

exports.accept = async (req, res) => {

    Saldo.findByIdAndUpdate(req.params.id, { $set: {isVerified: true, status: 'accepted'}}, { new: true })
        .then((topup) => {
            User.findById(topup.users).then((user) => {
                user.saldo += topup.value
                user.save()
                return res.status(200).json(
                    success('Request topup accepted!', user)
                )
            })
        })

    let saldo = await Saldo.findById(req.params.id)

    let user = await User.findById(saldo.users)

    var to = user.email
    var from = 'AGA@insurance.com'
    var subject = `Your Saldo is added!`
    var html = `Hi ${user.name}, your request saldo is accepted by admin. Now you can buy your insurance!
                    AGA Team`
    funcHelper.mail(to, from, subject, html)

}

exports.declined = async (req, res) => {

    Saldo.findByIdAndUpdate(req.params.id, { $set: {isVerified: true, status: 'declined'}}, { new: true })
    .then((topup) => {
        return res.status(201).json(
            success('Saldo is declined', topup)
        )
    })

let saldo = await Saldo.findById(req.params.id)

let user = await User.findById(saldo.users)

var to = user.email
var from = 'AGA@insurance.com'
var subject = `Your Saldo is declined!`
var html = `Sorry ${user.name}, your request saldo is declined by admin because the data is not valid.
                AGA Team`
funcHelper.mail(to, from, subject, html)

}

exports.cancel = async (req, res) => {

    Saldo.findByIdAndDelete(req.params.id)
        .then(() => {
            return res.status(200).json(
                success('Delete selected request topup!')
            )
        })
}

exports.check = async (req, res) => {
    let saldo = await Saldo.findOne({
        isVerified: false,
        users: req.decoded._id,
        status: 'pending'
    })
    if(!saldo) {
        return res.status(404).json(error('You dont have pending request!', '-', 404))
    }
    else{
        return res.status(200).json(success('Here is the pending request!', saldo))
    }
}
