const Setting = require('../models/Setting')
exports.getSettings = async (req,res,next) => {
    try {
        let settings = await Setting.findOne({})
        if(!settings){
            await Setting.create({
                payment:{
                    paypal:true,
                    stripe:false
                }
            })
            settings = await Setting.findOne({})
        }
        return res
            .status(200)
            .json({
                success:true,
                settings
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
exports.updateSettings = async (req,res,next) => {
    let settings = req.body
    try {
        let setting = await Setting.findOneAndUpdate(settings)
        return res
            .status(200)
            .json({
                success:true,
                message:'Settings are updated'
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