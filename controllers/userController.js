const User = require('../models/user.js')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
saltRounds = 10
const funcHelper = require('../helpers/funcHelper')
const {success, error} = require('../helpers/response')
const { sendResetPassword } = require('../services/nodemailer')
require('dotenv').config()

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var multer = require('multer');
var cloudinary = require('cloudinary');
var datauri = require('datauri');
var uploader = multer().single('image');

module.exports = {

    async createSuperAdmin(req, res){
        let user = await User.findOne({role: 'Super_Admin'}).select('role')
        if(user){
            return res.status(400).json(error("You can only create super admin once", "-", 400))
        }
        
        let hash = bcrypt.hashSync('123456', saltRounds)

        let data = await User.create({

            username: 'superadmin',
            email: 'super@gmail.com',
            name: 'super admin',
            password: hash,
            phone: '082342543654',
            address: 'superAdminHouse',
            gender: 'Male',
            birthPlace: 'superAdminPlace',
            birthDate: '10-10-2010',
            role: 'Super_Admin',
            isVerified: true,

        })

        let result = {
        
            username: data.username,
            name: data.name,
            gender: data.gender

        }    
        res.status(201).json(success("Super admin created!", result))
        
    },

    async createAdmin(req, res){
        try{
            
            let pwd = bcrypt.hashSync(req.body.password, saltRounds)

            let admin = await User.create({
                username:req.body.username,
                email:req.body.email,
                name:req.body.name,
                password:pwd,
                phone:req.body.phone,
                address:req.body.address,
                gender:req.body.gender,
                birthPlace:req.body.birthPlace,
                birthDate:req.body.birthDate,
                role:'Admin',
                isVerified:true
            })

            let result = {
                _id: admin._id,
                username: admin.username,
                email: admin.email
            }

            res.status(201).json(success("Admin created!", result))   
        }
        catch(err){
            res.status(422).json(error('Failed to create admin!', err.message, 422))
        }
    },

    async createClient(req, res){
        try{

            if(req.body.password.length <= 5 || req.body.password.length >= 33){
                return res.status(400).json(error('Password must be between 6-32 characters', '-', 400))
            }
            else{
                let pwd         = bcrypt.hashSync(req.body.password, saltRounds)
                var token       = funcHelper.token(20);
                var expToken    = new Date(new Date().setHours(new Date().getHours() + 6))
                let user = await User.create({
                    username:req.body.username,
                    email:req.body.email,
                    name:req.body.name,
                    password:pwd,
                    token: token,
                    expToken: expToken
                })
    
                var to               = req.body.email
                var from             = 'AGA@insurance.com'
                var subject          = 'Email verification in AGA';
    
                var link             = "http://"+req.get('host')+"/api/user/verify/"+token;
                var html             = 'Plese click link bellow, if you register at aga_insurance.com<br>';
                    html            += '<br><strong><a href='+link+'>'+"Verify Email"+'</a></strong>';
                    html            += '<br><br>Thanks';
                    
                await funcHelper.mail(to, from, subject, html)
    
                let result = {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    token: user.token
                }
                res.status(201).json(success("Client created!", result))
            }
        }
        catch(err){
            res.status(422).json(error('Failed to create client!', err.message, 422))
        }
    },

    async verify(req, res){
        try {
            let token = req.params.token;
            let users = await User.findOne({ token: token }).select('expToken')
            /* istanbul ignore next */
            if(Date.now()>users.expToken){
                return res.status(400).json(error('Token expired, please resend email confirm', err.message, 400))
            }
            await User.findOneAndUpdate({token: req.params.token}, {isVerified: true})
            res.status(200).redirect(process.env.FE_HOME_URL)
            
        }
        catch(err){
            res.status(422).json(error("Invalid token", err.message, 422))
        }
    },

    async resendVerify(req, res){
        try {

            var token       = funcHelper.token(20);

            var expToken    = new Date(new Date().setHours(new Date().getHours() + 6))

            let user = await User.findOneAndUpdate({email:req.body.email}, {token: token, expToken: expToken})
            
            var to               = req.body.email
            var from             = 'AGA@insurance.com'
            var subject          = 'Resend mail verification in AGA';

            var link             = "http://"+req.get('host')+"/api/user/verify/"+token;
            var html             = 'Plese click link bellow, to verify email at aga_insurance.com<br>';
                html            += '<br><strong><a href='+link+'>'+"Verify Email"+'</a></strong>';
                html            += '<br><br>Thanks';
                
            await funcHelper.mail(to, from, subject, html)

            let result = {
                _id: user._id,
                name: user.name,
                username: user.username,
                token: user.token
            }

            res.status(201).json(success("Email verification has been send!", result))

        }
        catch(err){
            res.status(400).json(error("Incorrect email", err, 400))
        }
        
    },
    
    async login(req, res){
        try{

            let user = await User.findOne({$or: [{email: req.body.login},{username: req.body.login}]})
            let isValid = await bcrypt.compare(req.body.password, user.password)

            if(user.isVerified!=true) return res.status(403).json(error('Please verify email first', '', 403))

            bcrypt.compare(req.body.password, user.password, function(err, data){
                if(data!=true) return res.status(403).json(error('Password incorrect!', err, 403))
                let token = jwt.sign({_id: user._id, role: user.role}, process.env.SECRET_KEY, {expiresIn: '24h'})
                res.setHeader('Authorization', token)
                let hasil = {
                    token: token,
                    _id: user._id,
                    role: user.role
                }
                return res.status(200).json(success('Token created! Access given!', hasil))
            })
        
        }
        catch(err){
            res.status(422).json(error('Failed to login!', err, 422))
        }
    },

    async show(req, res){
        let user = await User.findById(req.decoded._id)
        res.status(200).json(success('Show user details', user))
    },

    async showAdmin(req, res){
        let user = await User.find({role: 'Admin'}).select('-__v -saldo')
        res.status(200).json(success('Show all admin', user))
    },

    async update(req, res){
        /* istanbul ignore if */
        if(req.body.name == "" || req.body.name == null){
            return res.status(400).json(error("Failed to updated! Name can't be blank!", "-", 400))
        }
        try{
            let user = await User.findByIdAndUpdate(req.decoded._id, {
                name: req.body.name,
                gender: req.body.gender,
                phone: req.body.phone,
                address: req.body.address,  
                birthPlace: req.body.birthPlace,
                birthDate: req.body.birthDate,
            })
            res.status(200).json(success('Update user success', user))
        }
        catch(err){
            res.status(400).json(error('Update user failed', err.message, 400))
        }
    },

    async updatePassword(req, res){
        /* istanbul ignore else */
        if(req.body.password){
            let pwd = await bcrypt.hashSync(req.body.password.toString(), saltRounds)
            req.body.password = pwd
            let user = await User.findByIdAndUpdate(req.decoded._id, {
                password: req.body.password
            }, {new: true})
            res.status(200).json(success('Update user success', user))
        }
        /* istanbul ignore else */
        if(!req.body.password){
            return res.status(400).json(error("Failed to update! Password can't be blank!", "-", 400))
        }
    },

    async deleteUser(req, res){
        try{
            let user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json(success('Delete user success', user))
        }
        catch(err){
            res.status(400).json(error('Delete user failed', err.message, 400))
        }
    },

    async selectUser(req, res){
        try{
            let user = await User.findOne({_id: req.params.id, role: 'Admin'})
            res.status(200).json(success('Show user success', user))
        }
        catch(err){
            res.status(400).json(error('Show user failed', err.message, 400))
        }
    },

    /* istanbul ignore next */
    async uploadImage(req, res){

        var fileUp = req.file

        if (!fileUp) {
            return res.status(415).json(error('No file received: Unsupported Media Type', req.file, 415))
        }

        const dUri = new datauri()

        uploader(req, res, err => {
            var file = dUri.format(`${req.file.originalname}-${Date.now()}`, req.file.buffer);
            cloudinary.uploader.upload(file.content)
                .then(data => {
                    User.findByIdAndUpdate({_id: req.decoded._id},
                        {$set: {image: data.secure_url}},
                        {new: true})
                        .then((user) => {
                            return res.status(201).json(
                                success('Image uploaded!', user)
                            )
                        })
                })   
                .catch(err => {
                    res.status(400).json(error('Upload image falied', err, 400));
                })
        })

    },
    async sendResetPassword(req, res){

        var email = req.body.email;

        sendResetPassword(email, res)
    },
   
    async changePassword (req, res) {
        try{
            var token = req.body.token;

            let pwd = await bcrypt.hashSync(req.body.password, saltRounds)

            var decoded = await jwt.verify(token, process.env.SECRET_KEY);

            await User.updateOne({_id: decoded._id},{password: pwd})
            res.status(200).json(success('Password successfully updated!'))

        }
        catch(err){
            res.status(404).json(error('The token is expired or invalid', err, 404))
        }
    },

    async showClient(req, res){
        let user = await User.find({role: 'User'})
        res.status(200).json(success('Show all client', user))
    },

    async clientDetails(req, res){
        try{

            let user = await User.findById(req.params.id)
            res.status(200).json(success('Show selected clients details', user))

        }
        catch(err){
            res.status(404).json(error('Client not found', err, 404))  
        }      
    },
}
