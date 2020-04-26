const mongoose = require('mongoose')
const NotificationSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    type:{
        type:String
    },
    data:{
        type:mongoose.Schema.Types.Mixed
    },
    read:{
        type:Boolean,
        default:false
    },
    view:{
        type:Boolean,
        default:false
    },
    read_at:{
        type:Date,
        default:null
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Notification', NotificationSchema)