const express = require('express')
const router = express.Router()

const { getNotifications , addOrderNotification, readNotification, readAllNotifications } = require('../controllers/notifications')

router.route('/:userId')
    .get(getNotifications)
router.route('/all/:userId')
    .put(readAllNotifications)
router.route('/:id')
    .put(readNotification)
router.route('/order')
    .post(addOrderNotification)

module.exports =  router