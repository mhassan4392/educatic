const express = require('express')
const router = express.Router()

const { getSliders , addSlider , deleteSlider , updateSlider , getSlider } = require('../controllers/slider')

const { isAuthenticated } = require('../middlewares/auth')

router.route('/')
    .get(getSliders)
    .post(isAuthenticated,addSlider)

router.route('/:id')
    .delete(isAuthenticated,deleteSlider)
    .put(isAuthenticated,updateSlider)
    .get(getSlider)

module.exports = router