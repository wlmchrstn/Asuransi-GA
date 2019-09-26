const Promo = require('../models/promo.js');
const { success, error } = require('../helpers/response.js');

module.exports = {

    async createPromo(req, res) {
        try{
            let promo = await Promo.create(req.body)
            if(promo) return res.status(201).json(success(promo, 'Promo created!'))

        }
        catch(err){
            if(err) return res.status(422).json(error('Failed to create promo!'))
        }
    },

    async detailPromo(req, res) {
            let promo = Promo.findById(req.params.id)
            if(!promo) return res.status(404).json(error('Promo not found!'))
            if (promo) return res.status(200).json(success(promo, 'Here is the details!'))
    },

    async getAllPromo(req, res) {
            let promo = Promo.find({})
            return res.status(200).json(success(promo, 'Here is the list!'))
    },

    async updatePromo(req, res) {
        try {
            let updated = { new: true }
            let promo = Promo.findByIdAndUpdate(req.params.id, req.body, updated)
            if(promo) return res.status(200).json(success(promo, 'Promo updated!'))
        }
        catch(err){
            if(err) return res.status(422).json(error('Failed to update promo!'))
        }
    },

    async deletePromo(req, res) {
        try {
            let promo = Promo.findById(req.params.id)
            if(!promo) return res.status(404).json(error('Promo not found1'))
            let hasil = Promo.findByIdAndDelete(req.params.id)
            if(hasil){
                return res.status(204).json(success(hasil, 'Promo deleted!'))
            }
        }
        catch(err) {
            return res.status(422).json(error('Failed to delete promo!'))
        }
    }
}