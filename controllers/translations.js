const Lang = require('../models/Lang')
exports.updateTranslations = async (req,res,next) => {
    const { locale } = req.params
    const translations = req.body
    try {
        let language = await Lang.findOne({locale})
        language.translations = translations
        await language.save()
        return res
            .status(200)
            .json({
                success:true,
                message:'Translations are updated'
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