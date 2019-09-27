var jwt = require('jsonwebtoken');
var User = require('../models/user')

exports.isAuthenticated = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers.authorization
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (err) {
                return res.json({message: 'Failed to authenticate token'})
            }
            else {
                req.decoded = decoded;
                User.findById(req.decoded._id, (err, user)=>{
                    if (!user) return res.status(403).json({message: "there is no user found"});
                    else next()
                })
            }
        });
    }
    else {
        return res.status(401).send({
            message: 'No token provided'
        })
    }
}