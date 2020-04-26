const slugify = require('slugify')

const mongoose = require('mongoose')

const CatSchema = mongoose.Schema({
    name:{
        type:String,
        require:[true, 'Name field is reuired'],
        unique:[true, 'Category existed with this name already']
    },
    slug:String,
    date:{
        type:Date,
        default:Date.now
    }
})

CatSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower:true})
    next()
})

module.exports = mongoose.model('Category', CatSchema)