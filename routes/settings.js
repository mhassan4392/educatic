const express = require('express')
const router = express.Router()
const { isAuthenticated } =  require('../middlewares/auth')

const { updateSettings, getSettings } = require('../controllers/settings')

router.route('/')
    .get(getSettings)
    .put( isAuthenticated ,updateSettings)



module.exports = router