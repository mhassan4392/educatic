// load dependencies
const express = require('express')

// initialize router
const router = express.Router()

// load auth middleware
const { isAuthenticated } = require('../middlewares/auth')

// load controllers
const { register , login , forgotPassword , resetPassword , getMe } = require('../controllers/auth')

// route for register
router.route('/register')
    .post(register)

// route for login
router.route('/login')
    .post(login)

// route for getMe
router.route('/getMe')
    .get(isAuthenticated , getMe)

// route for forgotPassword
router.route('/forgotPassword')
    .post(forgotPassword)

// route for reset password
router.route('/updatePassword/:token')
    .post(resetPassword)




module.exports = router