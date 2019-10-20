const router = require('express').Router();
const formController = require('../../controllers/formController');
const auth = require('../../middlewares/auth')
const { permission } = require('../../middlewares/permission')

router.post('/:insurance', auth.isAuthenticated, formController.createForm)
router.get('/', auth.isAuthenticated, formController.getUserForm)
router.get('/:_id', auth.isAuthenticated, formController.getdetailForm)
router.delete('/:form', auth.isAuthenticated, permission, formController.deleteForm)
router.put('/buy/:form', auth.isAuthenticated, formController.buyInsurance)
router.put('/pay/:form', auth.isAuthenticated, formController.payInsurance)

module.exports = router;
