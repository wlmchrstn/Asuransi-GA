exports.permission = (req, res, next) => {
    if (req.decoded.role == 'User') {
        return res.status(403).json({
            message: 'You are not authorized'
        })
    }
    return next();
}

exports.superPermission = (req, res, next) => {
    if (req.decoded.role !== 'Super_Admin') {
        return res.status(403).json({
            message: 'You are not authorized'
        })
    }
    return next();
}
