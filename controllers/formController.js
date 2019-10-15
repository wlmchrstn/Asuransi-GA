const Form = require('../models/formInsurance.js');
const User = require('../models/user');
const Insurance = require('../models/insurance');
const { success, error } = require('../helpers/response.js');
const schedule = require('node-schedule')
const funcHelper = require('../helpers/funcHelper')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

let cronJob = schedule.scheduleJob('5 * * * *', function(){
    Form.find({status_pembayaran: 'active'})
        .populate('users')
        .then(result => {
            result.forEach(i => {
     
                let tanggal = i.tanggal_pembayaran.getDate()
                let date = Date.now()
                let today = date.getDate()
                if(tanggal == today){

                    var to               = i.users.email
                    var from             = 'AGA@insurance.com'
                    var subject          = 'Insurance is about to expired';
        
                    var html             = 'Your insurance is about to expired, please pay it before 7 days<br>';
                        
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

            form.save()

            res.status(201).json(success('Success to create form!', form))
        }
        catch (err) {
            res.status(422).json(error('Failed to create form!', err.message, 422))
        }
    },

    async getUserForm(req, res) {
        Form.find({ users: req.decoded._id })
            .select('-__v')
            .then(result => {
                res.status(200).json(success('Here is your list!', result))
            })
    },

    async buyInsurance(req, res) {

        try {
            
            let userId = req.decoded._id

            let form = await Form.findById(req.params.form)

            insuranceId = form.insurances.toString()

            let insurance = await Insurance.findById(insuranceId)

            let user = await User.findById(userId)

            saldo = user.saldo

            if (saldo < insurance.price) {
                return res.json(
                    `Hai ${user.name}, Your Saldo is Not Enough`
                )
            }

            else {

                let newTopUpsaldo = Number(saldo) - Number(insurance.price)

                await User.findByIdAndUpdate(userId,
                    { saldo: newTopUpsaldo },
                    { new: true })

                let date = new Date()
                date.setDate(5)

                await Form.findByIdAndUpdate(req.params.form,
                    {
                        status_pembayaran: "active",
                        tanggal_pembayaran: date
                    },
                    {
                        new: true
                    })

                res.status(200).json(
                    success('Insurance is actived', insurance.name_insurance)
                )
            }

        }
        catch(err){
            return res.status(406).json(error("Failed to purchase insurance", err.message, 406))
        }

    },

    async payInsurance(req, res) {
        try {
            let userId = req.decoded._id
            let user = await User.findById(userId)
            let auth = form.users.toString()
            let form = await Form.findById(req.params.form)
            insuranceId = form.insurances.toString()
            let insurance = await Insurance.findById(insuranceId)
            
            saldo = user.saldo
            price = insurance.price

            if(userId !== auth) {
                return res.status(403).json(error('This is not your form', "-", 403))
            }

            if (saldo < price) {
                return res.json(
                    `Hai ${user.name}, Your Saldo is Not Enough`
                )
            }
            else {
                let newTopUpsaldo = Number(saldo) - Number(price)
                await User.findByIdAndUpdate(userId,
                    { saldo: newTopUpsaldo },
                    { new: true })
                
                form.tanggal_pembayaran.setMonth((month + 1))
                form.save()
                res.status(200).json(
                    success('Payment successful', insurance.name_insurance)
                )
            }
        }
        catch(err){
            return res.status(406).json(error("Failed to pay insurance", err.message, 406))
        }
    },
    
    async deleteForm(req, res) {
        let valid = await Form.findById(req.params.form)
        if (!valid) return res.status(404).json(error('No form found!', "Form not found!", 404))
        userId = req.decoded._id.toString();
        formId = valid.users.toString();
        if (userId !== formId) return res.status(403).json(error('This is not your form!', "-", 403))
        Form.findByIdAndDelete(req.params.form)
            .then(result => {
                res.status(200).json(success('Form deleted!'))
            })
    }
}
