const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    payment:{
        type:String
    },
    data:{
        type:mongoose.Schema.Types.Mixed
    },
    status:{
        type:String,
        default:'recieved',
        enum:['recieved', 'processing', 'completed']
    },
    products:[
        {
            type:mongoose.Schema.Types.Mixed
        }
    ],
    address:{
        type:mongoose.Schema.Types.Mixed
    },
    amount:{
        type:Number,
        required:true
    },
    type:String,
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Order', OrderSchema)