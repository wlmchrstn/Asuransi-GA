const Form = require('../models/formInsurance.js');
const User = require('../models/user');
const Insurance = require('../models/insurance');
const { success, error } = require('../helpers/response.js');
const schedule = require('node-schedule')
const funcHelper = require('../helpers/funcHelper')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

schedule.scheduleJob('5 * * * ', function () {
    /* istanbul ignore next */
    Form.find({ status_pembayaran: 'active' })
        .populate('users')
        .then(result => {
            result.forEach(i => {
                let tanggal = i.tanggal_pembayaran.getDate()
                let date = new Date()
                let today = date.getDate()
                if (tanggal == today) {
                    var to = i.users.email
                    var from = 'AGA@insurance.com'
                    var subject = 'Insurance is about to expired';
                    var html = 'Your insurance is about to expired, please pay it before 7 days<br>';
                    funcHelper.mail(to, from, subject, html)
                }
            })
        })
})

schedule.scheduleJob('59 59 23 * * *', function () {
    /* istanbul ignore next */
    Form.find({ status_pembayaran: 'active' })
        .populate('users')
        .then(result => {
            result.forEach(i => {
                let tanggal = i.tanggal_pembayaran.getDate()
                let date = new Date()
                let today = date.getDate()
                if (tanggal == today) {
                    i.status_pembayaran = "inactive"
                    i.save()
                    var to = i.users.email
                    var from = 'AGA@insurance.com'
                    var subject = 'Insurance is expired';
                    var html = 'Your insurance is expired!<br>';
                    funcHelper.mail(to, from, subject, html)
                }
            })
        })
})

module.exports = {
    async createForm(req, res) {
        try {
            let userId = req.decoded._id
            let form = await Form.create(req.body)

            form.users = userId
            form.insurances = req.params.insurance

            if (req.body.NIK.length !== 16) {
                return res.status(406).json(
                    error('NIK Must have 16 characters', "-", 406)
                )
            }
            if (req.body.No_KK.length !== 16) {
                return res.status(406).json(
                    error('Nomor KK Must have 16 characters', "-", 406)
                )
            }
            form.save()
            res.status(201).json(success('Success to create form!', form))
        }
        catch (err) {
            res.status(422).json(error('Failed to create form!', err.message, 422))
        }
    },

    async getUserForm(req, res) {
        Form.find({ users: req.decoded._id })
            .populate({ path: 'insurances', select: 'name_insurance price' })
            .select('-__v')
            .then(result => {
                res.status(200).json(success('Here is your list!', result))
            })
    },

    async getdetailForm(req, res) {

        Form.findOne({ users: req.decoded._id, _id: req.params._id })
            .populate({ path: 'insurances', select: 'name_insurance price image' })
            .select('-__v')
            .then((form) => {
                res.status(200).json(success('Here is your form!', form))
            })
    },

    async buyInsurance(req, res) {

        let userId = req.decoded._id
        let form = await Form.findById(req.params.form)
        if (!form) {
            return res.status(404).json(error('Form Not Found', '-', 404))
        }
        insuranceId = form.insurances.toString()

        let insurance = await Insurance.findById(insuranceId)
        let user = await User.findById(userId)
        saldo = user.saldo

        if (saldo < insurance.price) {
            return res.status(406).json(
                `Hai ${user.name}, Your Saldo is Not Enough`
            )
        }

        let newTopUpsaldo = Number(saldo) - Number(insurance.price)
        await User.findByIdAndUpdate(userId,
            { saldo: newTopUpsaldo },
            { new: true })
        let date = new Date()
        date.setDate(5)
        date.setMonth(date.getMonth()+1)
        await Form.findByIdAndUpdate(req.params.form,
            {
                status_pembayaran: "active",
                tanggal_pembayaran: date
            },
            {
                new: true
            })
        res.status(200).json(success('Insurance is actived', insurance.name_insurance)
        )
    },

    async payInsurance(req, res) {

            let user = await User.findById(req.decoded._id)
            let form = await Form.findById(req.params.form)
            auth = form.users.toString()
            id = user.id.toString()
            insuranceId = form.insurances.toString()

            let insurance = await Insurance.findById(insuranceId)

            saldo = user.saldo
            price = insurance.price

            if (id !== auth) {
                return res.status(403).json(error('This is not your form', "-", 403))
            }
            /*istanbul ignore if */
            if (saldo < price) {
                return res.status(406).json(
                    `Hai ${user.name}, Your Saldo is Not Enough`
                )
            }
            else {
                let date = new Date(form.tanggal_pembayaran)
                date.setMonth(date.getMonth()+1)
                let newTopUpsaldo = Number(saldo) - Number(price)
                await User.findByIdAndUpdate(user._id,
                    { saldo: newTopUpsaldo },
                    { new: true })
                form.tanggal_pembayaran = date
                form.save()
                res.status(200).json(success('Payment successful', insurance.name_insurance))
            }
    },

    async deleteForm(req, res) {
        let valid = await Form.findById(req.params.form)
        if (!valid) return res.status(404).json(error('No form found!', "Form not found!", 404))
        userId = req.decoded._id.toString();
        formId = valid.users.toString();
        Form.findByIdAndDelete(req.params.form)
            .then(result => {
                res.status(200).json(success('Form deleted!'))
            })
    }
}
