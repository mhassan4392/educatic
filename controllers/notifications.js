const Notification = require('../models/Notification')
const User = require('../models/User')

// get user notifications
exports.getNotifications = async (req,res,next) => {
    const { userId } = req.params
    try {
        const notifications = await Notification.find({user:userId}).sort('-date')
        return res
            .status(200)
            .json({
                success:true,
                count:notifications.length,
                notifications
            })
    } catch (error) {
        return res
            .status(400)
            .json({
                success:false,
                message:error
            })
    }
}


// read notification
exports.readNotification = async (req,res,next) => {
    const { id } = req.params
    try {
        let notification = await Notification.findById(id)
        notification.read = true,
        notification.read_at = Date.now()
        await notification.save()
        return res
            .status(200)
            .json({
                success:true,
                message:'Notification readed'
            })
    } catch (error) {
        return res
            .status(400)
            .json({
                success:false,
                message:error
            })
    }
}


// read all notification
exports.readAllNotifications = async (req,res,next) => {
    const { userId } = req.params
    try {
        let notifications = await Notification.find({user:userId})
        notifications.map(async (notification) => {
            notification.read = true,
            notification.read_at = Date.now()
            await notification.save()
        })
        return res
            .status(200)
            .json({
                success:true,
                message:'Notifications are readed'
            })
    } catch (error) {
        return res
            .status(400)
            .json({
                success:false,
                message:error
            })
    }
}


// add a new notification
exports.addOrderNotification = async (req,res,next) => {
    try {
        let users = await User.find({status:'admin'}).select('_id')
        users.map( async (user) => {
            let payload = {
                user:user._id,
                data:req.body.order,
                type:'order'
            }
            await Notification.create()
        })
        return res
            .status(200)
            .json({
                success:true,
                message:'Notification added successfuly'
            })
    } catch (error) {
        return res
            .status(400)
            .json({
                success:false,
                message:error
            })
    }
}