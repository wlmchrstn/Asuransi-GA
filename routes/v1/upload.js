const express = require('express');
const router = express.Router();
const multer = require('multer');
const insurance = require('../../models/insurance');
const { success, error } = require('../../helpers/response');
const cloudinary = require('cloudinary');
const datauri = require('datauri');
const upload = require('../../middlewares/multer');
const uploader = multer().single('image')


router.post('/:id', upload.single('image'), (req, res) => {

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
                insurance.updateOne({_id: req.params.id},
                    {$set: {image: data.secure_url}},
                    {new: true})
                    .then((insurance) => {
                        return res.status(201).json(
                            success('Updated!', insurance)
                        )
                    })
            })   
            .catch(err => {
                /* istanbul ignore next */
                res.send(err);
            })
    })
})

module.exports = router;
