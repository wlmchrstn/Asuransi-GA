const router = require('express').Router();
const {isAuthenticated}= require('../../middlewares/auth');
const {permission, superPermission} = require('../../middlewares/permission');
const upload = require('../../middlewares/multer');
const {createSuperAdmin, createAdmin, createClient, login, selectUser,
        verify, resendVerify, show, update, updatePassowrd, updateSaldo, deleteUser,
        uploadImage, showAdmin, sendResetPassword, changePassword} = require('../../controllers/userController')

router.post('/super', createSuperAdmin)
router.post('/admin', isAuthenticated, superPermission, createAdmin)
router.post('/client', createClient)
router.post('/login', login)    
router.get('/verify/:token', verify)
router.post('/verify', resendVerify)
router.get('/show', isAuthenticated, show)
router.put('/update', isAuthenticated, update)
router.put('/update/password', isAuthenticated, updatePassword)
router.put('/update/saldo/:id', isAuthenticated, permission, updateSaldo)
router.delete('/deleteAdmin/:id', isAuthenticated, superPermission, deleteUser)
router.get('/selectAdmin/:id', isAuthenticated, superPermission, selectUser)
router.put('/upload', isAuthenticated, upload.single('image'), uploadImage)
router.get('/showAdmin/', isAuthenticated, superPermission, showAdmin)
router.post('/reset-password', sendResetPassword);
router.put('/reset', changePassword);

module.exports = router
