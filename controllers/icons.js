const Icon = require('../models/Icon')
const path = require('path')

// get all icons
exports.getIcons = async (req,res,next) => {
    try {
        const icons = await Icon.find().sort('order')
        return res
            .status(200)
            .json({
                success:true,
                count:icons.length,
                icons
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
exports.getIcon = async (req,res,next) => {}

// add new Icon
exports.addIcon = async (req,res,next) => {
    let newIcon = req.body
    try {
        await Icon.create(newIcon)
        return res
            .status(200)
            .json({
                success:true,
                message:'Icon added successfuly'
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


// update icon
exports.updateIcon = async (req,res,next) => {
    const { id } = req.params
    let updateIcon = req.body
    try {
        await Icon.findByIdAndUpdate(id, updateIcon)
        return res
            .status(200)
            .json({
                success:true,
                message:'Icon updated successfuly'
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

// delete icon
exports.deleteIcon = async (req,res,next) => {
    const { id } = req.params
    try {
        const icon = await Icon.findById(id)
        await icon.remove()
        return res
            .status(200)
            .json({
                success:true,
                message:'Icon deleted successfuly'
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
