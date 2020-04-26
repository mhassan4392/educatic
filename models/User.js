// load dependencies
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

// create new schema
const UserSchema = new mongoose.Schema({
    name:String,
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        default:'user',
        enum:['user' , 'publisher' , 'admin']
    },
    resetPasswordToken:String,
    tokenExpireDate:Date,
    date:{
        type:Date,
        default:Date.now()
    },
    avatar:{
        type:String,
        default:'no-user.png'
    },
    bio:{
        type:String
    },
    address:{
        address1:String,
        address2:String,
        phone:Number,
        country:String,
        city:String,
        state:String,
        zip:Number
    }
})

// before save user record hash the password
// UserSchema.pre('save', async function(next){
//     // if not modify password than don't run this function
//     if(!this.isModified('password')){
//         next()
//     }
//     try {
//         // hash the password method
//         const salt = await bcrypt.genSalt(10)
//         const hash = await bcrypt.hash(this.password, salt);
//         this.password = hash
//         next()
//     } catch (error) {
//         console.log(error.message)
//     }
// })

// use simple function with model methods to avoid some error /******* SIDE NOTE *******/
// generate jwt token
// UserSchema.methods.getJwtToken = async function() {
//     return await jwt.sign(
//         {id: this._id},
//         process.env.JWT_SECRET,
//         {expiresIn:process.env.JWT_EXPIRES}
//     )
// }

// match the requested password with the record password with hash
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(
        enteredPassword, this.password
    )
}

// set reset token for forgot password
UserSchema.methods.setResetToken = async function() {
    const resetToken = await crypto
                        .randomBytes(20)
                        .toString('hex')
    
    this.resetPasswordToken = await crypto
                                .createHash('sha256')
                                .update(resetToken)
                                .digest('hex')
    
    this.tokenExpireDate = await Date.now() + 10 * 60 * 1000

    return resetToken
}

module.exports = mongoose.model('User', UserSchema)