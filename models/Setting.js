const mongoose = require('mongoose')
const SettingSchema = mongoose.Schema({
    payment:{
        stripe:Boolean,
        paypal:Boolean
    }
})

module.exports = mongoose.model('Setting', SettingSchema )