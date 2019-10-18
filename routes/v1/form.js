const router = require('express').Router();
const formController = require('../../controllers/formController');
const auth = require('../../middlewares/auth')

router.post('/:insurance', auth.isAuthenticated, formController.createForm)
router.get('/', auth.isAuthenticated, formController.getUserForm)
router.get('/:_id', auth.isAuthenticated, formController.getdetailForm)
router.put('/buy/:form', auth.isAuthenticated, formController.buyInsurance)
router.put('/pay/:form', auth.isAuthenticated, formController.payInsurance)
router.delete('/:form', auth.isAuthenticated, formController.deleteForm)


module.exports = router;
