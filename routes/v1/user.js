const router = require('express').Router()
const {createSuperAdmin, createAdmin, createClient, login, verify, resendVerify} = require('../../controllers/userController')//initiate userController
//const {authenticate, merchantAuthenticate, customerAuthenticate} = require('../middlewares/authenticate')

router.post('/super', createSuperAdmin)// create super admin router
router.post('/admin', createAdmin)// create admin router
router.post('/client', createClient)// create client router
router.post('/login', login)// login router
router.get('/verify/:token', verify)// email verify router
router.post('/resendverify', resendVerify)// resend email verify router


module.exports = router