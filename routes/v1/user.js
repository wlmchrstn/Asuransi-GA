const router = require('express').Router()
<<<<<<< HEAD
const { isAuthenticated } = require('../../middlewares/auth')
const { permission, superPermission } = require('../../middlewares/permission')
// const superPermission = require('../../middlewares/super')
=======
const {isAuthenticated}= require('../../middlewares/auth')
const permission = require('../../middlewares/permission')
const superAdmin = require('../../middlewares/super')
const upload = require('../../middlewares/multer');
>>>>>>> [agam] user uploaPictured
const {createSuperAdmin, createAdmin, createClient, login, 
        verify, resendVerify, show, update, deleteUser,
        uploadImage, showAdmin} = require('../../controllers/userController')//initiate userController

router.post('/super', createSuperAdmin)// create super admin router
<<<<<<< HEAD
router.post('/admin', isAuthenticated, superPermission, createAdmin)// create admin router
=======
router.post('/admin', isAuthenticated, superAdmin, createAdmin)// create admin router
>>>>>>> [agam] user uploaPictured
router.post('/client', createClient)// create client router
router.post('/login', login)// login router     
router.get('/verify/:token', verify)// email verify router
router.post('/verify', resendVerify)// resend email verify router
router.get('/show', isAuthenticated, show)// show user router
router.put('/update', isAuthenticated, update)// update user router
router.delete('/deleteAdmin/:id', isAuthenticated, superAdmin, deleteUser)// delete admin router
router.post('/upload', isAuthenticated, upload.single('image'), uploadImage)// Upload image user router
router.get('/showAdmin/', isAuthenticated, superAdmin, showAdmin)// show all admin user router



module.exports = router