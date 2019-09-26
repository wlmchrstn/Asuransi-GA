const router = require('express').Router()
const auth = require('../../middlewares/auth')
const permission = require('../../middlewares/permission')
const {createSuperAdmin, createAdmin, createClient, login, 
        verify, resendVerify, show, update, deleteUser,
        uploadImage, showAdmin} = require('../../controllers/userController')//initiate userController
//const {authenticate, merchantAuthenticate, customerAuthenticate} = require('../middlewares/authenticate')

router.post('/super', createSuperAdmin)// create super admin router
router.post('/admin', createAdmin)// create admin router
router.post('/client', createClient)// create client router
router.post('/login', login)// login router
router.get('/verify/:token', verify)// email verify router
router.post('/resendverify', resendVerify)// resend email verify router
router.get('/show/:id', auth, show)// show user router
router.put('/update/:id', auth, update)// update user router
router.delete('/delete/:id', auth, permission, deleteUser)// delete user router
router.post('/upload/:id', auth, uploadImage)// Upload image user router
router.get('/showAdmin/', auth, permission, showAdmin)// show all admin user router



module.exports = router