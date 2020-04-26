const express = require('express')
const router = express.Router()

const { addProduct, removeProduct, emptyCart, getProducts, changeQty } = require('../controllers/cart')

router.route('/:userId')
    .post(addProduct)
    .delete(emptyCart)
    .get(getProducts)
router.route('/:productId/:userId')
    .delete(removeProduct)
    .post(changeQty)


module.exports = router