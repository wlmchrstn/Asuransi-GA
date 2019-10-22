const router = require('express').Router();
const {isAuthenticated}= require('../../middlewares/auth');
const {permission, superPermission} = require('../../middlewares/permission');
const upload = require('../../middlewares/multer');
const saldoController = require('../../controllers/saldoController');


router.post('/', isAuthenticated, saldoController.create);

router.get('/', isAuthenticated, permission, saldoController.showAll);

router.put('/upload/:id', isAuthenticated, upload.single('image'), saldoController.uploadphoto);

router.get('/:id', isAuthenticated, permission, saldoController.select);

router.delete('/:id', isAuthenticated, saldoController.delete);

router.put('/accept/:id', isAuthenticated, permission, saldoController.accept);

module.exports = router
