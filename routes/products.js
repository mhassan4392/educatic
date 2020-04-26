const express = require('express')
const router = express.Router()
const { isAuthenticated } = require('../middlewares/auth')

const { getProducts , addProduct , deleteProduct , updateProduct , getProduct, addReview, topSellingProducts } = require('../controllers/products')

router.route('/')
    .get(getProducts)
    .post(isAuthenticated , addProduct)

router.route('/topSellingProducts')
    .get(topSellingProducts)

router.route('/:id')
    .delete(isAuthenticated,deleteProduct)
    .put(isAuthenticated,updateProduct)
    .get(getProduct)

router.route('/:productId/:userId')
    .put(addReview)

module.exports =  router