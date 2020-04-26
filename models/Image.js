const mongoose = require('mongoose')
const ImageSchema = mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:'default-img.png'
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Image', ImageSchema)