const router = require('express').Router();
const formController = require('../../controllers/formController');
const auth = require('../../middlewares/auth')

router.post('/:id', auth.isAuthenticated, formController.createForm)
router.get('/', auth.isAuthenticated, formController.getUserForm)
router.delete('/:id', auth.isAuthenticated, formController.deleteForm)

module.exports = router;
