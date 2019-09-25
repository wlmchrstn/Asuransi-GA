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
        //var token = funcHelper.token(20);

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
            res.status(422).json(error('Failed to create admin!'))
        }
    },

    async createUser(req, res){
        try{
            let pwd = bcrypt.hashSync(req.body.password, saltRounds)
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
                role:'User',
                isVerified:true
            })
            let result = {
                _id: user._id,
                name: user.name,
                username: user.username
            }
            res.status(201).json(success(result, "User created!"))
        }
        catch(err){
            res.status(422).json(error('Failed to create user!'))
        }
    },
    
    async login(req, res){
        try{
            let user = await User.findOne({
                username: req.body.login
            }).select(['_id','username','password'])
            if(!user){
                let email = await User.findOne({
                    email: req.body.login
                }).select(['_id','email','password'])
                if(!email){
                    res.status(404,'Invalid username/email!')
                }
                let isCorrect = await bcrypt.compare(req.body.password, email.password)
                if(!isCorrect){
                    res.status(403).json('Password incorrect!')
                }
                let token = jwt.sign({_id: email._id}, process.env.LOGIN, {expiresIn: '1h'})
                res.status(200).json(token, 'Token created! Access given!')
            }
            let isValid = await bcrypt.compare(req.body.password, email.password)
            if(!isValid){
                res.status(403).json('Password incorrect!')
            }
            let tokens = jwt.sign({_id: user._id}, process.env.LOGIN, {expiresIn: '1h'})
            res.status(200).json(tokens, 'Token created! Access given!')
        }
        catch(err){
            res.status(422).json(error('Failed to login!'))
        }
    }
}

