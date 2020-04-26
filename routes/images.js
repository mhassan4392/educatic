const express = require('express')
const router = express.Router()

const { getImages , addImage , deleteImage , updateImage , getImage } = require('../controllers/images')

const { isAuthenticated } = require('../middlewares/auth')

router.route('/')
    .get(getImages)
    .post(isAuthenticated,addImage)

router.route('/:id')
    .delete(isAuthenticated,deleteImage)
    .put(isAuthenticated,updateImage)
    .get(getImage)



module.exports = router