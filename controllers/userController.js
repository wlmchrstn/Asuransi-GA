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
            address: 'superAdminHouse',
            gender: 'Male',
            birthPlace: 'superAdminPlace',
            birthDate: 10102010,
            role: 'Super_Admin',
            isVerified: true,

            })

        let result = {
            
            username: 'super_admin',
            name: 'super admin',
            gender: 'Male'

        } 

        res.status(201).json(success(result,"create super admin user"))
    },

    async createAdmin(req, res){

        let hash = bcrypt.hashSync(req.body.password, saltRounds)
        //var token = funcHelper.token(20);

        let data = await User.create({

            username: req.body.username,
            email: req.body.email,
            name: req.body.name,
            password: hash,
            phone: req.body.phone,
            address: req.body.address,
            gender: req.body.gender,
            birthPlace: req.body.birthPlace,
            birthDate: req.body.birthDate,
            role: 'Admin',
            isVerified: true

            })

        let result = {
            
            username: data.username,
            email: data.email,
            name: data.name,
            phone: data.phone,
            address: data.address,
            gender: data.gender,
            birthPlace: rdata.birthPlace,
            birthDate: data.birthDate

        }

        res.status(201).json(success(result,"create super admin user"))
    },

    async create(req, res){

        var hash = bcrypt.hashSync(req.body.password, saltRounds)
        var token = funcHelper.token(20);

        req.body['token']       = token;
        req.body['expToken']    = new Date(new Date().setHours(new Date().getHours() + 6))
        req.body['password']    = hash

        await User.create(req.body, (err, data)=>{

            if(err) return res.status(422).json(error(err.message))
            
            var to              = req.body.email
            var from            = 'My@Ecommerce.com'
            var subject         = 'Verify your mail in my E-Commerce';

            var link            = "http://"+req.get('host')+"/api/user/verify/"+token;
            var html            = 'Plese click link bellow, if you register at Ecommerce.com<br>';
                html            += '<br><strong><a href='+link+'>'+"Verify Email"+'</a></strong>';
                html            += '<br><br>Thanks';
                
            funcHelper.mail(to, from, subject, html)
            res.status(201).json(success(data, "user client created"))
            
        })
    },

    verifyEmail(req, res){

        let token = req.params.token;
        User.findOne({ token: token }, 'expToken').exec()
        .then((users)=>{

            if(Date.now()<users.expToken){
                User.findOneAndUpdate({token: req.params.token}, {isVerified: true}, (err, data)=>{
                    //if (!data) return res.status(400).json(error("the token is not exist"))
                    res.status(200).json(success(data, "email verified success"))
                })
            }
            else{
                res.status(422).json(error('Time token validations is expired, please resend email confirm'))
            }
        })
        .catch((err)=>{
            res.status(422).json(error(err, "Invalid email verification link"))
        })
    },

    login(req, res){
        User.findOne({email: req.body.email,
                     isVerified: true}, (err, user)=>{
            if (user) {
                bcrypt.compare(req.body.password, user.password, function (err, result) {
                    if (result == true) {
                            jwt.sign({ _id: user._id,roles: user.roles }, process.env.SECRET_KEY, {expiresIn: '1h'},function(err, token) {
                            res.status(200).json(success(token, "token created"));
                        });
                    }
                    else res.status(403).json(error("incorrect password"));
                
            })
            } else {
                res.status(403).json(error("unverified email"));
            }
        })
    }
}

