const express = require('express')
const router = express.Router()

const { getLangs , addLang , deleteLang , updateLang , getLang } = require('../controllers/langs')

router.route('/')
    .get(getLangs)
    .post(addLang)

router.route('/:locale')
    .delete(deleteLang)
    .put(updateLang)
    .get(getLang)



module.exports = router