const router = require('express').Router();
const {isAuthenticated}= require('../../middlewares/auth');
const {permission, superPermission} = require('../../middlewares/permission');
const upload = require('../../middlewares/multer');
const saldoController = require('../../controllers/saldoController');


router.post('/', isAuthenticated, saldoController.create);

router.get('/', isAuthenticated, permission, saldoController.showAll);

router.get('/detail/pending', isAuthenticated, saldoController.showAllinUser);

router.get('/detail/history', isAuthenticated, saldoController.showUserHistory);

router.put('/upload/:id', isAuthenticated, upload.single('image'), saldoController.uploadphoto);

router.get('/:id', isAuthenticated, permission, saldoController.select);

router.delete('/cancel/:id', isAuthenticated, saldoController.cancel);

router.put('/accept/:id', isAuthenticated, permission, saldoController.accept);

router.put('/declined/:id', isAuthenticated, permission, saldoController.declined);

router.get('/show/pending', isAuthenticated, saldoController.check);

module.exports = router
