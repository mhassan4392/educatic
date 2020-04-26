const express = require('express')
const router = express.Router()

const { getLanguages , addLanguage , deleteLanguage , updateLanguage , getLanguage } = require('../controllers/languages')

const { isAuthenticated } = require('../middlewares/auth')

router.route('/')
    .get(getLanguages)
    .post( isAuthenticated,addLanguage)

router.route('/:id')
    .delete(isAuthenticated,deleteLanguage)
    .put(isAuthenticated,updateLanguage)
    .get(getLanguage)



module.exports = router