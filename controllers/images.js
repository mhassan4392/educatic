const Image = require('../models/Image')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const fs = require('fs')

// get all images
exports.getImages = async (req,res,next) => {
    try {
        const images = await Image.find()
        return res
            .status(200)
            .json({
                success:true,
                count:images.length,
                images
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
exports.getImage = async (req,res,next) => {}

// add new image
exports.addImage = async (req,res,next) => {
    let newImage = req.body
    try {

        let preImage = await Image.find({type:newImage.type})
        if(preImage.length > 0){
            return res
                    .status(400)
                    .json({
                        success:false,
                        message:'This Type Image is Already exist'
                    })
        }
        let image = req.files ? req.files.image : null
        if(image){
            if(!image.mimetype.startsWith('image')){
                return res
                    .status(400)
                    .json({
                        success:false,
                        message:'Plz upload an image file'
                    })
            }
            if(image.size > 2048000){
                return res
                    .status(400)
                    .json({
                        success:false,
                        message:'Image size must be less than 2 mb'
                    })
            }
            if(!fs.existsSync(process.env.FILE_UPLOAD_LOACTION+'/images')){
                fs.mkdirSync(process.env.FILE_UPLOAD_LOACTION+'/images')
            }
            let newName = uuidv4()
            image.name = `images_${newName}${path.parse(image.name).ext}`
            image.mv(`${process.env.FILE_UPLOAD_LOACTION}/images/${image.name}`, err => {
                if(err){
                    return res
                        .status(400)
                        .json({
                            success:false,
                            message:err
                        })
                }
            })
            newImage.image = image.name
        }
        await Image.create(newImage)
        return res
            .status(200)
            .json({
                success:true,
                message:'Image added successfuly'
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


// update image
exports.updateImage = async (req,res,next) => {
    const { id } = req.params
    let updateImage = req.body
    try {
        let preImage = await Image.findById(id)
        let newType = await Image.findOne({type:updateImage.type})
        if(newType){
            if(newType.type != preImage.type){
                return res
                    .status(400)
                    .json({
                        success:false,
                        message:'This Type Image is Already exist'
                    })
            }
        }
        let image = req.files ? req.files.image : null
        if(image){
            if(!image.mimetype.startsWith('image')){
                return res
                    .status(400)
                    .json({
                        success:false,
                        message:'Plz upload an image file'
                    })
            }
            if(image.size > 2048000){
                return res
                    .status(400)
                    .json({
                        success:false,
                        message:'Image size must be less than 2 mb'
                    })
            }
            if(!fs.existsSync(process.env.FILE_UPLOAD_LOACTION+'/images')){
                fs.mkdirSync(process.env.FILE_UPLOAD_LOACTION+'/images')
            }
            let preAvatar = process.env.FILE_UPLOAD_LOACTION+'/images/'+preImage.image
            if(fs.existsSync(preAvatar)){
                fs.unlinkSync(preAvatar)
            }
            let newName = uuidv4()
            image.name = `image_${newName}${path.parse(image.name).ext}`
            image.mv(`${process.env.FILE_UPLOAD_LOACTION}/images/${image.name}`, err => {
                if(err){
                    return res
                        .status(400)
                        .json({
                            success:false,
                            message:err
                        })
                }
            })
            updateImage.image = image.name
        }
        await Image.findByIdAndUpdate(id, updateImage)
        return res
            .status(200)
            .json({
                success:true,
                message:'Image updated successfuly'
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

// delete image
exports.deleteImage = async (req,res,next) => {
    const { id } = req.params
    try {
        const image = await Image.findById(id)
        let avatar = process.env.FILE_UPLOAD_LOACTION+'/images/'+image.image
        if(fs.existsSync(avatar)){
            fs.unlinkSync(avatar)
        }
        await image.remove()
        return res
            .status(200)
            .json({
                success:true,
                message:'Image deleted successfuly'
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
