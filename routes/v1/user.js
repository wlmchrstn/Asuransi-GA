const router = require('express').Router()
const {createSuperAdmin, createAdmin, create, login} = require('../../controllers/userController')//initiate userController
//const {authenticate, merchantAuthenticate, customerAuthenticate} = require('../middlewares/authenticate')

router.post('/super', createSuperAdmin)//create super admin router
router.post('/admin', createAdmin)//create admin router
router.post('/client', create)//create admin router
router.post('/login', login)//create admin router

module.exports = router