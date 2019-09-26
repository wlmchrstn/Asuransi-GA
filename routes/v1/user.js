const router = require('express').Router()
const {isAuthenticated}= require('../../middlewares/auth')
const permission = require('../../middlewares/permission')
const {createSuperAdmin, createAdmin, createClient, login, 
        verify, resendVerify, show, update, deleteUser,
        uploadImage, showAdmin} = require('../../controllers/userController')//initiate userController

router.post('/super', createSuperAdmin)// create super admin router
router.post('/admin', createAdmin)// create admin router
router.post('/client', createClient)// create client router
router.post('/login', login)// login router
router.get('/verify/:token', verify)// email verify router
router.post('/resendverify', resendVerify)// resend email verify router
router.get('/show', isAuthenticated, show)// show user router
router.put('/update', isAuthenticated, update)// update user router
router.delete('/delete/:id', isAuthenticated, permission, deleteUser)// delete user router
router.post('/upload/:id', isAuthenticated, uploadImage)// Upload image user router
router.get('/showAdmin/', isAuthenticated, permission, showAdmin)// show all admin user router



module.exports = router