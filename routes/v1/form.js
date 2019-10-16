const router = require('express').Router();
const formController = require('../../controllers/formController');
const auth = require('../../middlewares/auth')

router.post('/:insurance', auth.isAuthenticated, formController.createForm)
router.get('/', auth.isAuthenticated, formController.getUserForm)
router.get('/:form', auth.isAuthenticated, formController.getdetailForm)
router.delete('/:form', auth.isAuthenticated, formController.deleteForm)
router.put('/buy/:form', auth.isAuthenticated, formController.buyInsurance)

module.exports = router;
