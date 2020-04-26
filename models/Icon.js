const mongoose = require('mongoose')
const IconSchema = mongoose.Schema({
    icon:{
        type:String,
        required:true
    },
    url:{
        type:String
    },
    order:{
        type:Number,
        default:1
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Icon', IconSchema)