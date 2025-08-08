const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = async (userInfo, res) => {
    try {
        return jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' })
    } catch (error) {
        res.status(500).json({
            message: 'Error occured on generating access token.',
            status: 'error'
        })
    }

}
