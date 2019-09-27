const router = require('express').Router()
const {isAuthenticated}= require('../../middlewares/auth')
const {permission, superPermission} = require('../../middlewares/permission')
const upload = require('../../middlewares/multer');
const {createSuperAdmin, createAdmin, createClient, login, 
        verify, resendVerify, show, update, deleteUser,
        uploadImage, showAdmin} = require('../../controllers/userController')

router.post('/super', createSuperAdmin)
router.post('/admin', isAuthenticated, superPermission, createAdmin)
router.post('/client', createClient)
router.post('/login', login)    
router.get('/verify/:token', verify)
router.post('/verify', resendVerify)
router.get('/show', isAuthenticated, show)
router.put('/update', isAuthenticated, update)
router.delete('/deleteAdmin/:id', isAuthenticated, superPermission, deleteUser)
router.post('/upload', isAuthenticated, upload.single('image'), uploadImage)
router.get('/showAdmin/', isAuthenticated, superPermission, showAdmin)



module.exports = router