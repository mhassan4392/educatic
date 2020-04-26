const express = require('express')
const router = express.Router()

const { payWithCard, payWithPaypal, payWithCardDigital, payWithPaypalDigital, getKey } = require('../controllers/payment')

router.route('/card')
    .post(payWithCard)
router.route('/card/digital')
    .post(payWithCardDigital)
router.route('/paypal')
    .post(payWithPaypal)
router.route('/paypal/digital')
    .post(payWithPaypalDigital)
router.route('/getKey')
    .post(getKey)
module.exports = router