const router = require('express').Router()
const promoRouter = require('../../controllers/promoController.js')

router.get('/', promoRouter.getAllPromo)

module.exports = router;
