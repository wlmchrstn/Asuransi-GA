var jwt = require('jsonwebtoken');
var User = require('../models/user')

exports.isAuthenticated = function (req, res, next) {
    var token = req.headers.authorization
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            /* istanbul ignore if */
            if (err) {
                return res.json({message: 'Failed to authenticate token'})
            }
            else {
                req.decoded = decoded;
                User.findById(req.decoded._id, (err, user)=>{
                    if (!user) return res.status(403).json({message: `${err}`});
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
