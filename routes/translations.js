const express = require('express')
const router = express.Router()

const { updateTranslations } = require('../controllers/translations')
const { isAuthenticated } = require('../middlewares/auth')

router.route('/:locale')
    .put(isAuthenticated,updateTranslations)



module.exports = router