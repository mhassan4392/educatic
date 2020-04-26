const mongoose = require('mongoose')
const slugify = require('slugify')

const ProductSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Name field is required'],
        unique:[true, 'Product already exists with this name']
    },
    excerpt:{
        type:String
    },
    slug:String,
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:[true, 'Category required']
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true, 'User required']
    },
    buyers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        }
    ],
    description:{
        type:String,
        required:[true, 'Description is required']
    },
    price:{
        type:Number,
        required:[true, 'Price is required']
    },
    avatar:{
        type:String,
        default:'no-product.png'
    },
    sales:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:[true,'Must be loggedIn to give review']
            },
            feedback:String,
            rating:{
                type:Number,
                required:[true, 'Rating is required']
            },
            date:{
                type:Date,
                default:Date.now
            }
        }
    ],
    type:{
        type:String,
        required:true,
        default:'physical',
        enum:['physical','digital']
    },
    link:String,
    date:{
        type:Date,
        default:Date.now
    }
})

ProductSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower:true})
    next()
})

module.exports = mongoose.model('Product', ProductSchema)