var express = require('express');
var router = express.Router();
var insuranceController = require('../../controllers/insuranceController');
var upload = require('../../middlewares/multer');
var auth = require('../../middlewares/auth');
var {permission} = require('../../middlewares/permission')


router.post('/create', auth.isAuthenticated, permission, insuranceController.createInsurance);

router.put('/:id', auth.isAuthenticated, permission, upload.single('image'), insuranceController.uploadphoto);

router.get('/', insuranceController.ShowAllInsurance);

router.get('/detail/:id', insuranceController.ShowOneInsurance);

router.put('/update/:id', auth.isAuthenticated, permission, insuranceController.updateInsurance);

router.delete('/delete/:id', auth.isAuthenticated, permission, insuranceController.deleteInsurance);

router.get('/search', insuranceController.Search)

module.exports = router;
