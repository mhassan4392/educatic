// load dependencies
const express = require('express')

// initialize router
const router = express.Router()

// load controllers
const { getUsers , getUser , deleteUser , addUser , updateUser , updateProfile } = require('../controllers/users')

// load auth middleware
const { isAuthenticated } = require('../middlewares/auth')

// get all users route
router.route('/')
    .get(getUsers)
    .post( isAuthenticated,addUser)

// get single user route    
router.route('/:id')
    .get(getUser)
    .delete(isAuthenticated , deleteUser)
    .put(isAuthenticated,updateUser)

// profile routes
router.route('/profile/:id')
    .put(isAuthenticated,updateProfile)

module.exports = router