const router = require('express').Router()
const userController = require('../controllers/userController')//initiate userController
//const {authenticate, merchantAuthenticate, customerAuthenticate} = require('../middlewares/authenticate')

router.post('/super', userController.createSuper)//create super admin router

module.exports = router