const router = require('express').Router();
const formController = require('../../controllers/formController');
const auth = require('../../middlewares/auth');
const { permission } = require('../../middlewares/permission');
const upload = require('../../middlewares/multer');

router.post('/:insurance', auth.isAuthenticated, formController.createForm);
router.get('/', auth.isAuthenticated, formController.getUserForm);
router.get('/:_id', auth.isAuthenticated, formController.getdetailForm);
router.delete('/:form', auth.isAuthenticated, formController.deleteForm);
router.put('/buy/:form', auth.isAuthenticated, formController.buyInsurance);
router.put('/pay/:form', auth.isAuthenticated, formController.payInsurance);
router.get('/showAll/:user_id', auth.isAuthenticated, permission, formController.showAll);
router.get('/active/all', auth.isAuthenticated, permission, formController.active);
router.put('/verify/:form', auth.isAuthenticated, permission, upload.single('image'), formController.verify);
router.put('/reject/:form', auth.isAuthenticated, permission, formController.reject);
router.put('/upload/kk/:id', auth.isAuthenticated, upload.single('image'), formController.upload_kk);
router.put('/upload/npwp/:id', auth.isAuthenticated, upload.single('image'), formController.upload_npwp);
router.put('/review/:form', auth.isAuthenticated, formController.review);

module.exports = router;
