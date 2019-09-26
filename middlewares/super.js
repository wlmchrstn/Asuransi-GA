module.exports = (req, res, next) => {
    if (req.decode.role !== 'Super_Admin') {
        return res.status(403).json({
            message: 'You are not authorized'
        })
    }
    return next();
}