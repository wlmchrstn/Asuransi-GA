const Promo = require('../models/promo.js');
const Insurance = require('../models/insurance.js');
const cloudinary = require('cloudinary').v2
const Datauri = require('datauri');
const datauri = new Datauri();
const { success, error } = require('../helpers/response.js');
const multer = require('multer')
const upload = multer().single('image')

module.exports = {
    async uploadPromo(req, res) {
        const file = datauri.format(`${req.file.originalname}-${Date.now()}`, req.file.buffer);
        cloudinary.uploader.upload(file.content)
            .then(data =>{
                Promo.findOneAndUpdate(
                    {
                        _id: req.params.id
                    },
                    {
                        $set: {image: data.url}
                    },
                    {
                        new: true
                    },
                    function(err, result){
                        res.status(200).json(success(result, 'Promo image uploaded!'))
                    })
            })
            .catch(err => {
                res.status(422).json(error('Failed to upload image!'))
            })  
    },

    async uploadInsurance(req, res) {
        const file = datauri.format(`${req.file.originalname}-${Date.now()}`, req.file.buffer);
        cloudinary.uploader.upload(file.content)
            .then(data =>{
                Insurance.findOneAndUpdate({_id: req.params.id},
                    {
                        $set: {image: data.url}
                    },
                    {new: true},
                    function(err, result){
                        res.status(200).json(success(result, 'Insurance image uploaded!'))
                    })
            })
            .catch(err => {
                res.status(422).json(error('Failed to upload image!'))
            })
    }
}