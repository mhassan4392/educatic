const Slider = require('../models/Slider')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const fs = require('fs')

// get all sliders
exports.getSliders = async (req,res,next) => {
    try {
        const sliders = await Slider.find().sort('order')
        return res
            .status(200)
            .json({
                success:true,
                count:sliders.length,
                sliders
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
exports.getSlider = async (req,res,next) => {}

// add new slider
exports.addSlider = async (req,res,next) => {
    let newSlider = req.body
    try {

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
            let newName = uuidv4()
            if(!fs.existsSync(process.env.FILE_UPLOAD_LOACTION+'/sliders')){
                fs.mkdirSync(process.env.FILE_UPLOAD_LOACTION+'/sliders')
            }
            image.name = `slider_${newName}${path.parse(image.name).ext}`
            image.mv(`${process.env.FILE_UPLOAD_LOACTION}/sliders/${image.name}`, err => {
                if(err){
                    return res
                        .status(400)
                        .json({
                            success:false,
                            message:err
                        })
                }
            })
            newSlider.image = image.name
        }
        await Slider.create(newSlider)
        return res
            .status(200)
            .json({
                success:true,
                message:'Slider added successfuly'
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


// update slider
exports.updateSlider = async (req,res,next) => {
    const { id } = req.params
    let updateSlider = req.body
    try {

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
            let slider = await Slider.findById(id)
            if(!fs.existsSync(process.env.FILE_UPLOAD_LOACTION+'/sliders')){
                fs.mkdirSync(process.env.FILE_UPLOAD_LOACTION+'/sliders')
            }
            let preAvatar = process.env.FILE_UPLOAD_LOACTION+'/sliders/'+slider.image
            if(fs.existsSync(preAvatar)){
                fs.unlinkSync(preAvatar)
            }
            let newName = uuidv4()
            image.name = `slider_${newName}${path.parse(image.name).ext}`
            image.mv(`${process.env.FILE_UPLOAD_LOACTION}/sliders/${image.name}`, err => {
                if(err){
                    return res
                        .status(400)
                        .json({
                            success:false,
                            message:err
                        })
                }
            })
            updateSlider.image = image.name
        }
        await Slider.findByIdAndUpdate(id, updateSlider)
        return res
            .status(200)
            .json({
                success:true,
                message:'Slider updated successfuly'
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

// delete slider
exports.deleteSlider = async (req,res,next) => {
    const { id } = req.params
    try {
        const slider = await Slider.findById(id)
        let avatar = process.env.FILE_UPLOAD_LOACTION+'/sliders/'+slider.image
        if(fs.existsSync(avatar)){
            fs.unlinkSync(avatar)
        }
        await slider.remove()
        return res
            .status(200)
            .json({
                success:true,
                message:'Slider deleted successfuly'
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
