var express = require('express');
var router = express.Router();
var insuranceController = require('../../controllers/insuranceController');
var upload = require('../../middlewares/multer');


router.post('/', insuranceController.createInsurance);

router.post('/:id', upload.single('image'), insuranceController.uploadphoto);

router.get('/', insuranceController.ShowAllInsurance);

router.get('/:id', insuranceController.ShowOneInsurance);

router.put('/:id', insuranceController.updateInsurance);

router.delete('/delete/:id', insuranceController.deleteInsurance);

module.exports = router;