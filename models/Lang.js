const mongoose = require('mongoose')

const LangSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    locale:{
        type:String,
        required:true
    },
    translations:
        {
            type:mongoose.Schema.Types.Mixed
        },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Lang', LangSchema)