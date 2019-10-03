var nodemailer = require('nodemailer');
var nodemailersendGrid = require('nodemailer-sendgrid');
require('dotenv').config();

var transporter = nodemailer.createTransport(
    nodemailersendGrid({
        apiKey: process.env.SENDGRID_API_KEY
    })
);

var jwt = require('jsonwebtoken');
var user = require('../models/user');
var { success, error } = require('../helpers/response');

exports.sendResetPassword = async (email, res) => {

    const userExist = await user.findOne({email: email, isVerified: true});

    if (!userExist) {
        return res.status(404).json(
            error('Register and verifvy email first', '', 404)
        )
    }

    const token = await jwt.sign({_id: userExist._id}, process.env.SECRET_KEY, {expiresIn: '1h'})

    transporter.sendMail({
        from: 'AGA@insurance.com',
        to: email,
        subject: 'Reset Password',
        html: `<p>Klik link dibawah ini untuk reset password</p>
        <a href="http://asuransi-glints-academy.herokuapp.com/api/user/reset/${token}" target="_blank">Reset Password</a>`
    })
    .then(() => res.status(200).json(
        success(`Email sent to ${email}`, token)
    ))
    /* istanbul ignore next */
    .catch(err => res.send(err))
}