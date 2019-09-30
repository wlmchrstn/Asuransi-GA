const Form = require('../models/formInsurance.js');
const { success, error } = require('../helpers/response.js');

module.exports = {
    async createForm(req, res) {
        try{
            let userId = req.decoded._id
            console.log(userId)
            let form = await Form.create(req.body)
            form.users = userId
            form.insurances = req.params.id
            form.save()
            res.status(201).json(success('Success to create form!', form))
        }
        catch(err){
            res.status(422).json(error('Failed to create form!', err, 422))
        }
    },

    async getUserForm(req, res) {
        Form.find({users: req.decoded._id})
            .then(result => {
                res.status(200).json(success('Here is your list!', result))
            })
    },

    async deleteForm(req, res) {
        let valid = await Form.findById(req.params.id)
        if(!valid) return res.status(404).json(error('No form found!', "Form not found!", 404))
        userId = req.decoded._id.toString();
        formId = valid.users.toString();
        if (userId !== formId) return res.status(403).json(error('This is not your form!', "-", 403))
        Form.findByIdAndDelete(req.params.id)
            .then(result => {
                res.status(200).json(success('Form deleted!'))
            })
            .catch(err => {
                res.status(422).json(error('Failed to delete form!', err, 422))
            })
    }
}
