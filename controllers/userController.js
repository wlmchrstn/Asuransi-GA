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
            res.status(422).json(error('Failed to create admin!'))
        }
    },

    async createUser(req, res){
        try{
            // create hashed password
            let pwd = bcrypt.hashSync(req.body.password, saltRounds)
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
                role:'User',
                isVerified:true
            })
            // resolve
            let result = {
                _id: user._id,
                name: user.name,
                username: user.username
            }
            // response
            res.status(201).json(success(result, "User created!"))
        }
        catch(err){
            res.status(422).json(error('Failed to create user!'))
        }
    },
    
    async login(req, res){
        try{
            // find user by username
            let user = await User.findOne({
                username: req.body.login
            }).select(['_id','username','password','role'])
            if(!user){
                // find user by email if by username is not found
                let email = await User.findOne({
                    email: req.body.login
                }).select(['_id','email','password','role'])
                if(!email){
                    res.status(404).json(error('Invalid username/email!'))
                }
                // check validation
                let isCorrect = await bcrypt.compare(req.body.password, email.password)
                if(!isCorrect){
                    res.status(403).json(error('Password incorrect!'))
                }
                // create token
                let token = jwt.sign({_id: email._id}, process.env.LOGIN, {expiresIn: '1h'})
                res.status(200).json(success(token, 'Token created! Access given!'))
            }
            // check validation
            let isValid = await bcrypt.compare(req.body.password, email.password)
            if(!isValid){
                res.status(403).json(error('Password incorrect!'))
            }
            // create token
            let tokens = jwt.sign({_id: user._id}, process.env.LOGIN, {expiresIn: '1h'})
            res.status(200).json(success(tokens, 'Token created! Access given!'))
        }
        catch(err){
            res.status(422).json(error('Failed to login!'))
        }
    }
}

