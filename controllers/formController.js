const Form = require('../models/formInsurance.js');
const User = require('../models/user');
const Insurance = require('../models/insurance');
const { success, error } = require('../helpers/response.js');

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

                await Form.findByIdAndUpdate(req.params.form,
                    {
                        status_pembayaran: "ACTIVE"
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

