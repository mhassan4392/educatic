const express = require('express')
const router = express.Router()

const { getCats , addCat , deleteCat , updateCat } = require('../controllers/cat')

const {isAuthenticated} = require('../middlewares/auth')

router.route('/')
    .get(getCats)
    .post(isAuthenticated,addCat)

router.route('/:id')
    .delete(isAuthenticated,deleteCat)
    .put(isAuthenticated,updateCat)

module.exports =  router