var express = require('express');
var router = express.Router();
var insuranceController = require('../../controllers/insuranceController');
var upload = require('../../middlewares/multer');
var auth = require('../../middlewares/auth');
var {permission} = require('../../middlewares/permission')


router.post('/', auth.isAuthenticated, permission, insuranceController.createInsurance);

router.post('/:id', auth.isAuthenticated, permission, upload.single('image'), insuranceController.uploadphoto);

router.get('/', insuranceController.ShowAllInsurance);

router.get('/:id', insuranceController.ShowOneInsurance);

router.put('/:id', auth.isAuthenticated, permission, insuranceController.updateInsurance);

router.delete('/delete/:id', auth.isAuthenticated, permission, insuranceController.deleteInsurance);

module.exports = router;