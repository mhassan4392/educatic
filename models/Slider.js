const mongoose = require('mongoose')
const SliderSchema = mongoose.Schema({
    heading:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
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

module.exports = mongoose.model('Slider', SliderSchema)