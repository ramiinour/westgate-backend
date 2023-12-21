const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split('Bearer ')[1]

    if (token == null) return res.status(401).json({message: 'Unauthorized'})

    jwt.verify(token, config.jwtSetting.secret, (err, user) => {

        if (err) return res.status(403).json({message: 'Forbidden'})

        req.user = user

        next()
    })
}

module.exports = {
    authenticate
};