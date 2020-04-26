// User controller
const path = require('path')
const bcrypt = require('bcryptjs')
const fs = require('fs')
// load models
const User = require('../models/User')
const Cart = require('../models/Cart')

// get users controller
exports.getUsers = async (req,res,next) => {
    try {
        const users = await User.find().select('-password')
        return res
            .status(200)
            .json({
                success:true,
                count:users.length,
                users
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

// get single user controller
exports.getUser = async (req,res,next) => {
    const { id } = req.params
    try {
        const user = await User.findById(id).select(["-password"])
        if(!user){
            return res
                .status(400)
                .json({
                    success:false,
                    message:'user not found'
                })
        }
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

// controller for adding new user
exports.addUser = async (req,res,next) => {
    const { email , name , password , role } = req.body
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
        
        return res
            .status(200)
            .json({
                success:true,
                user
            })
    } catch (error) {
        return res
            .status(400)
            .json({
                success:false,
                message:error
            })
    }
}

// update user
exports.updateUser = async (req,res,next) => {
    const { id } = req.params
    const { name , email , password , role } = req.body
    try {
        let user = await User.findById(id)
        user.name = name
        user.email = email
        user.role = role
        if(password){
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt);
            user.password = hash
        }
        await user.save({
            new:true
        })
        return res
            .status(200)
            .json({
                success:true,
                message:'User updated successfuly'
            })
    } catch (error) {
        return res
            .status(400)
            .json({
                success:false,
                message:error
            })
    }
}

// delete single user controller
exports.deleteUser = async (req,res,next) => {
    const { id } = req.params
    try {
        const user = await User.findById(id)
        if(!user){
            return res
                .status(400)
                .json({
                    success:false,
                    message:'user not found'
                })
        }
        if(req.user.role != 'admin'){
            return res
                .status(400)
                .json({
                    success:false,
                    message:'Your are not authourized to delete this account'
                })
        }
        let cart = await Cart.findOne({user:user._id})
        let avatar = process.env.FILE_UPLOAD_LOACTION+'/user/'+user.avatar
        if(fs.existsSync(avatar) && avatar != 'no-user.png'){
            fs.unlinkSync(avatar)
        }
        cart.remove()
        await user.remove()
        return res
            .status(200)
            .json({
                success:true,
                message:'user deleted successfuly'
            })
    } catch (error) {
        return res
            .status(400)
            .json({
                success:false,
                message:error
            })
    }
}

// update profile controller
exports.updateProfile = async (req,res,next) => {
    const { id } = req.params
    const updateProfile = req.body
    try {
        let avatar = req.files ? req.files.avatar : null
        if(avatar){
            if(!avatar.mimetype.startsWith('image')){
                return res
                    .status(400)
                    .json({
                        success:false,
                        message:'Plz upload an image file'
                    })
            }
            if(avatar.size > 2048000){
                return res
                    .status(400)
                    .json({
                        success:false,
                        message:'Image size must be less than 2 mb'
                    })
            }
            let user = await User.findById(id)
            if(!fs.existsSync(process.env.FILE_UPLOAD_LOACTION+'/users')){
                fs.mkdirSync(process.env.FILE_UPLOAD_LOACTION+'/users')
            }
            let preAvatar = process.env.FILE_UPLOAD_LOACTION+'/users/'+user.avatar
            if(fs.existsSync(preAvatar) && preAvatar != 'no-user.png'){
                fs.unlinkSync(preAvatar)
            }
            avatar.name = `user_${req.body.email}${path.parse(avatar.name).ext}`
            avatar.mv(`${process.env.FILE_UPLOAD_LOACTION}/users/${avatar.name}`, err => {
                if(err){
                    return res
                        .status(400)
                        .json({
                            success:false,
                            message:err
                        })
                }
            })
            updateProfile.avatar = avatar.name
        }

        if(updateProfile.password){
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(updateProfile.password, salt);
            updateProfile.password = hash
        }
        user = await User.findByIdAndUpdate(id, updateProfile)
        return res
            .status(200)
            .json({
                success:true,
                message:'Profile updated successfuly',
                user
            })
    } catch (error) {
        return res
            .status(400)
            .json({
                success:false,
                message:error
            })
    }
}

