const router = require('express').Router()
const {createSuperAdmin} = require('../../controllers/userController')//initiate userController
//const {authenticate, merchantAuthenticate, customerAuthenticate} = require('../middlewares/authenticate')

router.post('/super', createSuperAdmin)//create super admin router

module.exports = router