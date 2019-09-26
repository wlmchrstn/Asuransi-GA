const Insurance = require('../models/insurance.js');
const { success, error } = require('../helpers/response.js');

module.exports = {

    async detailPromo(req, res) {
            Insurance.findById(req.params.id)
                .then(result => {
                    res.status(200).json(success("Here is the details!", result))
                })
                .catch(err => {
                    res.status(404).json(error('Promo not found!', err, 404))
                })
    },

    async getAllPromo(req, res) {
            Insurance.find({ isPromo: true })
                .then(result => {
                    res.status(200).json(success("Here is the list!", result))
                })
    }
}
