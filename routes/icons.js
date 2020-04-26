const express = require('express')
const router = express.Router()

const { getIcons , addIcon , deleteIcon , updateIcon , getIcon } = require('../controllers/icons')

const { isAuthenticated } = require('../middlewares/auth')

router.route('/')
    .get(getIcons)
    .post(isAuthenticated ,addIcon)

router.route('/:id')
    .delete(isAuthenticated,deleteIcon)
    .put(isAuthenticated,updateIcon)
    .get(getIcon)



module.exports = router