const router = require('express').Router();
const {isAuthenticated}= require('../../middlewares/auth');
const {permission, superPermission} = require('../../middlewares/permission');
const upload = require('../../middlewares/multer');
const saldoController = require('../../controllers/saldoController');


router.post('/', isAuthenticated, saldoController.create);

router.get('/', permission, saldoController.showAll);

router.put('/upload', isAuthenticated, upload.single('image'), saldoController.uploadphoto);

router.get('/:id', permission, saldoController.select);

router.delete('/:id', isAuthenticated, saldoController.delete);

router.post('/accept/:id', permission, saldoController.accept);

module.exports = router
