const Insurance = require('../models/insurance.js');
const { success, error } = require('../helpers/response.js');

module.exports = {
    async getAllPromo(req, res) {
            Insurance.find({ isPromo: true })
                .then(result => {
                    res.status(200).json(success("Here is the list!", result))
                })
    }
}
