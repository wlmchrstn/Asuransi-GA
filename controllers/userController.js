const User = require('../models/user.js')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
saltRounds = 10
const funcHelper = require('../helpers/funcHelper')
const {success, error} = require('../helpers/response')

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {

    async createSuperAdmin(req, res){

        let hash = bcrypt.hashSync('12345', saltRounds)

        let data = await User.create({

            username: 'super_admin',
            email: 'super@gmail.com',
            name: 'super admin',
            password: hash,
            phone: '082342543654',
            address: 'adminHouse',
            gender: 'Male',
            birthPlace: 'adminPlace',
            birthDate: 10102010,
            role: 'Super_Admin',
            isVerified: true,

            })

        let result = {
            
            username: data.username,
            name: data.name,
            gender: data.gender

        }    
        res.status(201).json(success(result,"Super admin created!"))
    },

    async createAdmin(req, res){
        try{
            // create hashed password
            let pwd = bcrypt.hashSync(req.body.password, saltRounds)
            // create admin
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
            // resolve
            let result = {
                _id: admin._id,
                username: admin.username,
                email: admin.email
            }
            // response
            res.status(201).json(success(result, "Admin created!"))   
        }
        catch(err){
            res.status(422).json(error('Failed to create admin!', err.message, 422))
        }
    },

    async createClient(req, res){
        try{
            // create hashed password
            let pwd         = bcrypt.hashSync(req.body.password, saltRounds)
            // craete token verify
            var token       = funcHelper.token(20);
            // create expToken
            var expToken    = new Date(new Date().setHours(new Date().getHours() + 6))
            // create user
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
            // send email verification
            var to               = req.body.email
            var from             = 'AGA@insurance.com'
            var subject          = 'Email verification in AGA';

            var link             = "http://"+req.get('host')+"/user/verify/"+token;
            var html             = 'Plese click link bellow, if you register at aga_insurance.com<br>';
                html            += '<br><strong><a href='+link+'>'+"Verify Email"+'</a></strong>';
                html            += '<br><br>Thanks';
                
            await funcHelper.mail(to, from, subject, html)
            // resolve
            let result = {
                _id: user._id,
                name: user.name,
                username: user.username
            }
            // response
            res.status(201).json(success(result, "Client created!"))
        }
        catch(err){
            res.status(422).json(error('Failed to create client!', err, 422))
        }
    },

    
    // verify email
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
            // create token verify
            var token       = funcHelper.token(20);
            // create expToken
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
            // response
            res.status(201).json(success(result, "Email verification has been send!"))

        }
        catch(err){
            res.status(400).json(error("Incorrect email", err, 400))
        }
        
    },
    
    async login(req, res){
        try{
            // find user by username
            let user = await User.findOne({$or: [{email: req.body.login},{username: req.body.login}]})
         
            // check email verification
            if(user.isVerified!=true){
                return res.status(403).json(error('Please verify email first', '', 403))
            }

            // check validation
            let isValid = await bcrypt.compare(req.body.password, user.password)
            if(!isValid){
                return res.status(403).json(error('Password incorrect!', err.message, 403))
            }
            // create token
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

    async update(req, res){
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
    }
}