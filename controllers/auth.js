// auth route controllers
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// load dependencies
const crypto = require('crypto')

// load models
const User = require('../models/User')
const Cart = require('../models/Cart')

// load sendMail utils
const sendMail = require('../utils/sendMail')

// controller for registering new user
exports.register = async (req,res,next) => {
    let { email , name , password , role , items } = req.body
    try {
        // check if user exist with that email
        let user = await User.findOne({email})
        if(user){
            return res
                .status(400)
                .json({
                    success:false,
                    message:'user already exist with this email'
                })
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt);
        let hashedPassword = hash

        let newUser = {
            name,
            email,
            role,
            password:hashedPassword
        }

        // if user not exist than create new user
        user = await User.create(newUser)
        // create a cart for that user
        let cart = await Cart.create({
            user:user._id
        })

        if(items){
            let newItem = {}
            items.forEach(element => {
                newItem.product = element._id
                newItem.quantity = element.quantity
                let productIndex = cart.products.findIndex(product => product.product == element._id)
                if(productIndex == -1){
                    cart.products.push(newItem)
                }else{
                    cart.products[productIndex].quantity += element.quantity
                }
            })
            await cart.save()
        }



        // now get the jwt token
        let token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRES}
            )
        // return user and success true if new user create
        const data = {
            _id:user.id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            bio:user.bio,
            role:user.role,
            address:user.address,
            token
        }
        return res
            .status(200)
            .json({
                success:true,
                data
            })
    } catch (error) {
        return res
            .status(400)
            .json({
                success:false,
                message:'something went wrong'
            })
    }
}

// controller for logging user
exports.login = async (req,res,next) => {
    const { email , password , items } = req.body
    try {
        // check if user exist with req email
        let user = await User.findOne({email})

        // if user not exist return error
        if(!user){
            return res
                .status(400)
                .json({
                    success:false,
                    message:'user not exist with request email'
                })
        }

        // if user exists match password with the record password
        const isMatch = await user.matchPassword(password)
        // if password not match return error
        if(!isMatch){
            return res
                .status(400)
                .json({
                    success:false,
                    message:'password not match'
                })
        }

        // if password match then get the token
        let token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRES}
            )
        // now send user and token
        const data = {
            _id:user.id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            bio:user.bio,
            role:user.role,
            address:user.address,
            token
        }

        if(items){
            let cart = await Cart.findOne({user:data._id})
            let newItem = {}
            items.forEach(element => {
                newItem.product = element._id
                newItem.quantity = element.quantity
                let productIndex = cart.products.findIndex(product => product.product == element._id)
                if(productIndex == -1){
                    cart.products.push(newItem)
                }else{
                    cart.products[productIndex].quantity += element.quantity
                }
            })
            await cart.save()
        }
        return res
            .status(200)
            .json({
                success:true,
                data
            })

    } catch (error) {
        return res
            .status(400)
            .json({
                success:false,
                message:error.message
            })
    }
}

// controller for getting the auth user
exports.getMe = async (req,res,next) => {
    try {
        // get authenticated user from req user
        const user = await User.findById(req.user)
        return res
            .status(200)
            .json({
                success:true,
                data:user
            })
    } catch (error) {
        return res
            .status(400)
            .json({
                success:false,
                message:error.message
            })
    }
}


// controller for forgot password
exports.forgotPassword = async (req,res,next) => {
    const { email } = req.body
    try {
        // check if user exist with the req email
        const user = await User.findOne({email})
        // if user not found send error
        if(!user){
            return res
                .status(400)
                .json({
                    success:false,
                    message:'user not exist with this email'
                })
        }
        // if user exists then send the email for resetting
        const resetToken = await user.setResetToken()
        // now save the user
        await user.save({
            validateBeforeSave:false
        })
        // now send the email to the user for password reset
        const options = {
            email,
            subject:'Reset Password',
            message:`Please reset your password by going to this mail ${req.protocol}://${req.get('host')}/auth/updatePassword/${resetToken}` 
        }

        try {
            await sendMail(options)
            return res
            .status(200)
            .json({
                success:true,
                data:resetToken,
                message:'email sent'
            })
        } catch (error) {
            return res
                .status(400)
                .json({
                    success:false,
                    message:error.message
                })
        }
    } catch (error) {
         return res
            .status(400)
            .json({
                success:false,
                message:error.message
            })
    }
}

// controller for reset password
exports.resetPassword = async (req,res,next) => {
    const { token } = req.params
    const resetToken = crypto.createHash('sha256').update(token).digest('hex')
    try {
        const user = await User.findOne({
            resetPasswordToken:resetToken,
            tokenExpireDate: {$gt: Date.now()}
        })
        if(!user){
            return res
                .status(400)
                .json({
                    success:false,
                    message:'Not authorized'
                })
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(req.body.password, salt);
        let hashedPassword = hash
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.tokenExpireDate = undefined
        await user.save({validateBeforeSave:false})
        return res
            .status(200)
            .json({
                success:true,
                data:user
            })
    } catch (error) {
        return res
            .status(400)
                .json({
                    success:false,
                    message:error.message
                })
    }
}