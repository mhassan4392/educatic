const express = require('express')
const router = express.Router()
const { isAuthenticated } =  require('../middlewares/auth')

const { getOrders, getReports , getOrder , addOrder , deleteOrder , updateOrder } = require('../controllers/order')

router.route('/getReports')
    .get(getReports)

router.route('/')
    .get(getOrders)
    .post(addOrder)

router.route('/:id')
    .get(getOrder)
    .delete(isAuthenticated ,deleteOrder)
    .put(isAuthenticated ,updateOrder)

module.exports =  router