const Form = require('../models/formInsurance.js');
const User = require('../models/user');
const Insurance = require('../models/insurance');
const { success, error } = require('../helpers/response.js');
const schedule = require('node-schedule')
const multer = require('multer');
const cloudinary = require('cloudinary');
const datauri = require('datauri');
const uploader = multer().single('image');
const funcHelper = require('../helpers/funcHelper')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* istanbul ignore next */
schedule.scheduleJob('5 * * * ', function () {
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


/* istanbul ignore next */
schedule.scheduleJob('59 59 23 * * *', function () {
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

            let exist = await User.findById(userId)

            let form = await Form.create({
                name: req.body.name,
                NIK: req.body.NIK,
                gender: req.body.gender,
                birthDate: req.body.birthDate,
                birthPlace: req.body.birthPlace,
                blood_type: req.body.blood_type,
                status: req.body.status,
                phone: exist.phone,
                NPWP: req.body.NPWP,
                address: req.body.address,
                city: req.body.city,
                postalCode: req.body.postalCode,
                No_KK: req.body.No_KK,
                email: exist.email,
                job: req.body.job,
                position: req.body.position,
                penyakit_sekarang: req.body.penyakit_sekarang,
                penyakit_dulu: req.body.penyakit_dulu,
                status_pembayaran: 'pending',
                isVerified: false,
                isReviewed: false
            })

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

    async upload_kk(req, res) {

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
                    Form.findByIdAndUpdate({ _id: req.params.id },
                        { $set: { image_kk: data.secure_url } },
                        { new: true })
                        .then((form) => {
                            /* istanbul ignore next */
                            return res.status(201).json(
                                success('Updated!', form)
                            )
                        })
                })
                .catch(/* istanbul ignore next */err => {
                    res.send(err);
                })
        })

    },

    async upload_npwp(req, res) {

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
                    Form.findByIdAndUpdate({ _id: req.params.id },
                        { $set: { image_npwp: data.secure_url } },
                        { new: true })
                        .then((form) => {
                            /* istanbul ignore next */
                            return res.status(201).json(
                                success('Updated!', form)
                            )
                        })
                })
                .catch(/* istanbul ignore next */err => {
                    res.send(err);
                })
        })

    },

    async getUserForm(req, res) {
        Form.find({ users: req.decoded._id })
            .populate({ path: 'insurances', select: 'name_insurance price' })
            .sort({createdAt: -1})
            .select('-__v -rejected')
            .then(result => {
                res.status(200).json(success('Here is your list!', result))
            })
    },

    async showAll(req, res) {
            let form = await Form.find({ users: req.params.user_id }).populate('insurances', 'name_insurance').sort({createdAt: -1})
            res.status(200).json(success('Show all form from selected user!', form))
    },

    async getdetailForm(req, res) {

        Form.findOne({ users: req.decoded._id, _id: req.params._id })
            .populate({ path: 'insurances', select: 'name_insurance price image' })
            .select('-__v -rejected')
            .then((form) => {
                if (!form) {
                    return res.status(404).json(error('Form Not Found', '-', 404))
                }
                res.status(200).json(success('Here is your form!', form))
            })
    },

    async buyInsurance(req, res) {
        let userId = req.decoded._id
        let form = await Form.findById(req.params.form)
        if (!form) {
            return res.status(404).json(error('Form Not Found', '-', 404))
        }
        if (form.isVerified === false) {
            return res.status(406).json(error('Your Form is still not accept by admin', '', 406))
        }
        if (form.status_pembayaran === 'rejected') {
            return res.status(406).json(error('Your Form is rejecteded from admin because the data is not valid', '', 406))
        }
        insuranceId = await form.insurances.toString()
        let insurance = await Insurance.findById(insuranceId)
        let user = await User.findById(userId)
        saldo = user.saldo
        if (saldo < insurance.price || saldo < insurance.price_promo) {
            return res.status(406).json(error(`Hai ${user.name}, Your Saldo is Not Enough`, '-', 406))
        }
        if (insurance.isPromo === true) {
            let newTopUpsaldo = Number(saldo) - Number(insurance.price_promo)
            await User.findByIdAndUpdate(userId,
                { saldo: newTopUpsaldo },
                { new: true })
            let date = new Date()
            date.setDate(5)
            date.setMonth(date.getMonth() + 1)
            await Form.findByIdAndUpdate(req.params.form,
                {
                    status_pembayaran: "active",
                    tanggal_pembayaran: date
                },
                { new: true })
            res.status(200).json(success('Insurance is actived', insurance.name_insurance))
        }
        else {
            let newTopUpsaldo = Number(saldo) - Number(insurance.price)
            await User.findByIdAndUpdate(userId,
                { saldo: newTopUpsaldo },
                { new: true })
            let date = new Date()
            date.setDate(5)
            date.setMonth(date.getMonth() + 1)
            await Form.findByIdAndUpdate(req.params.form,
                {
                    status_pembayaran: "active",
                    tanggal_pembayaran: date
                },
                { new: true })
            res.status(200).json(success('Insurance is actived', insurance.name_insurance))
        }
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
            date.setMonth(date.getMonth() + 1)
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
    },

    async active(req, res) {

        Form.find({$or: [{status_pembayaran: 'active'} , {status_pembayaran: 'inactive'}]})
            .populate({ path: 'insurances', select: 'name_insurance price' })
            .select('-__v')
            .then(result => {
                res.status(200).json(success('Show all active form!', result))
            })
    },

    async verify(req, res) {
        let form = await Form.findById(req.params.form)
        let insurances = await Insurance.findById(form.insurances)
        let data = await Form.findByIdAndUpdate(req.params.form, { $set: { isVerified: true } }, { new: true }) 
        /* istanbul ignore else */
        if(data) {
            var to = form.email
            var from = 'AGA@insurance.com'
            var subject = `Form Insurance (${insurances.name_insurance}) is accepted`
            var html = `Hi ${form.name}, your form (${insurances.name_insurance}) is accepted. Now you can buy your insurance!`
            funcHelper.mail(to, from, subject, html)
            const dUri = new datauri()
            uploader(req, res, err => {
                var file = dUri.format(`${req.file.originalname}-${Date.now()}`, req.file.buffer);
                cloudinary.uploader.upload(file.content)
                    .then(result => {
                        /* istanbul ignore next */
                        data.proof = result.secure_url
                        data.save()
                        res.status(201).json(success('Form Updated!', data))
                    })
                    .catch(/* istanbul ignore next */err => {
                        res.send(err);
                    })
            })
        }
    },

    async reject(req, res) {

        let form = await Form.findById(req.params.form)

        let insurances = await Insurance.findById(form.insurances)

        Form.findByIdAndUpdate(req.params.form, { $set: { isVerified: true, status_pembayaran: 'rejected' } }, { new: true })
            .then((result) => {
                var to = form.email
                var from = 'AGA@insurance.com'
                var subject = `Form Insurance (${insurances.name_insurance}) is rejected`
                var html = `Hi ${form.name}, your form (${insurances.name_insurance}) is rejecteded because data is not valid`
                funcHelper.mail(to, from, subject, html)

                return res.status(201).json(
                    success('Form Rejected!', result)
                )
            })
    },

    async review(req, res) {

        Form.findByIdAndUpdate(req.params.form, {$set: {isReviewed: true}}, {new:true})
            .then((form) => {
                return res.status(201).json(
                    success('You can give feedback of our insurance!', form)
                )
            })
    }
}
