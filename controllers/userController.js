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
        try{
            let hash = bcrypt.hashSync('12345', saltRounds)

            let data = await User.create({

                username: 'super_admin',
                email: 'super@gmail.com',
                name: 'super admin',
                password: hash,
                phone: '082342543654',
                address: 'superAdminHouse',
                gender: 'Male',
                birthPlace: 'superAdminPlace',
                birthDate: 10102010,
                role: 'Super_Admin',
                isVerified: true,

            })

            let result = {
            
                username: data.username,
                name: data.name,
                gender: data.gender

            }    
            res.status(201).json(success("Super admin created!", result))
        }
        catch(err){
            res.status(400).json(error("You can only create super admin once", err.message, 400))
        }
        
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

            res.status(201).json(success(result, "Admin created!"))   
        }
        catch(err){
            res.status(422).json(error('Failed to create admin!', err.message, 422))
        }
    },

    async createClient(req, res){
        try{

            let pwd         = bcrypt.hashSync(req.body.password, saltRounds)

            var token       = funcHelper.token(20);

            var expToken    = new Date(new Date().setHours(new Date().getHours() + 6))

            let user = await User.create({
                username:req.body.username,
                email:req.body.email,
                name:req.body.name,
                password:pwd,
                phone:req.body.phone,
                address:req.body.address,
                gender:req.body.gender,
                birthPlace:req.body.birthPlace,
                birthDate:req.body.birthDate,
                token: token,
                expToken: expToken

            })

            var to               = req.body.email
            var from             = 'AGA@insurance.com'
            var subject          = 'Email verification in AGA';

            var link             = "http://"+req.get('host')+"/user/verify/"+token;
            var html             = 'Plese click link bellow, if you register at aga_insurance.com<br>';
                html            += '<br><strong><a href='+link+'>'+"Verify Email"+'</a></strong>';
                html            += '<br><br>Thanks';
                
            await funcHelper.mail(to, from, subject, html)

            let result = {
                _id: user._id,
                name: user.name,
                username: user.username
            }

            res.status(201).json(success(result, "Client created!"))
        }
        catch(err){
            res.status(422).json(error('Failed to create client!', err, 422))
        }
    },

    

    async verify(req, res){
        try {
            let token = req.params.token;
            let users = await User.findOne({ token: token }).select('expToken')
            if(Date.now()<users.expToken){
                User.findOneAndUpdate({token: req.params.token}, {isVerified: true}, (err, data)=>{
                    res.status(200).json(success("email verified success", data))
                })
            }
            else{
                res.status(400).json(error('Token expired, please resend email confirm', err.message, 400))
            }
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

            var link             = "http://"+req.get('host')+"/user/verify/"+token;
            var html             = 'Plese click link bellow, to verify email at aga_insurance.com<br>';
                html            += '<br><strong><a href='+link+'>'+"Verify Email"+'</a></strong>';
                html            += '<br><br>Thanks';
                
            await funcHelper.mail(to, from, subject, html)

            let result = {
                _id: user._id,
                name: user.name,
                username: user.username
            }

            res.status(201).json(success(result, "Email verification has been send!"))

        }
        catch(err){
            res.status(400).json(error("Incorrect email", err, 400))
        }
        
    },
    
    async login(req, res){
        try{

            let user = await User.findOne({$or: [{email: req.body.login},{username: req.body.login}]})
         

            if(user.isVerified!=true){
                return res.status(403).json(error('Please verify email first', '', 403))
            }


            let isValid = await bcrypt.compare(req.body.password, user.password)
            if(!isValid){
                return res.status(403).json(error('Password incorrect!', err.message, 403))
            }

            let token = jwt.sign({_id: user._id, role: user.role}, process.env.SECRET_KEY, {expiresIn: '1h'})
            return res.status(200).json(success('Token created! Access given!', token))
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
        let user = await User.find({role: 'Admin'})
        res.status(200).json(success('Show user details', user))
    },

    async update(req, res){
        if(req.body.password){
            let pwd = bcrypt.hashSync(req.body.password, saltRounds)
            req.body.password = pwd
        }
        try{
            let user = await User.findByIdAndUpdate(req.decoded._id, req.body)
            res.status(200).json(success('Update user success', user))
        }
        catch(err){
            res.status(400).json(error('Update user failed', err.message, 400))
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

        var token = req.params.token;

        var password = req.body.password;

        var decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded) {
            return res.status(404).json(
                error('The token is expired or invalid', err, 404)
            )
        }

        bcrypt.hash(password, 10, (err, hash) => {

            if (err) throw err;

            User.updateOne(
                { _id: decoded._id},
                { $set: {password: hash}},
                {new: true})
                .exec()
                .then(() => {
                    return res.status(201).json(
                        success('Password successfully updated!')
                    )
                }) 
        })
    }
    


}