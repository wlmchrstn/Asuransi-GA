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
            
            username: 'super_admin',
            name: 'super admin',
            gender: 'Male'

        }    
        res.status(201).json(success(result,"create super admin user"))
    }
}

