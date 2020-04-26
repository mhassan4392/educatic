const Lang = require('../models/Lang')
const enTranslation = require('../localization/locales/en.json')

// get all languagess
exports.getLanguages = async (req,res,next) => {
    try {
        let languages = await Lang.find()
        if(languages.length == 0){
            const lang = { name:'English', locale:'en', translations:enTranslation }
            await Lang.create(lang)
            languages = await Lang.find()
        }
        let langs = languages.map(lang => {
            let la = {  _id:lang._id , name:lang.name, locale:lang.locale }
            return la
        })
        let translations = {}
        languages.map(lang => {
            translations[lang.locale] = lang.translations
        })
        return res
            .status(200)
            .json({
                success:true,
                count:languages.length,
                languages:langs,
                translations
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

// get language
exports.getLanguage = async (req,res,next) => {
    
}

// add a new language
exports.addLanguage = async (req,res,next) => {
    const { locale, name } = req.body
    try {
        const langLocale = await Lang.findOne({locale})
        if(langLocale){
            return res
            .status(400)
            .json({
                success:true,
                message:'Language already existed with this locale'
            })
        }
        const langName = await Lang.findOne({name})
        if(langName){
            return res
            .status(400)
            .json({
                success:true,
                message:'Language already existed with this name'
            })
        }
        const language = {
            name,
            locale,
            translations:enTranslation
        }
        await Lang.create(language)
        return res
            .status(200)
            .json({
                success:true,
                message:'Language added successfuly'
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


// delete language
exports.deleteLanguage = async (req,res,next) => {
    const { id } = req.params
    try {
        const language = await Lang.findById(id)
        if(language.locale == 'en'){
            return res
            .status(400)
            .json({
                success:false,
                message:'You can not delete this language'
            })        
        }
        await language.remove()
        return res
            .status(200)
            .json({
                success:true,
                message:'Language deleted successfuly'
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


// update language
exports.updateLanguage = async (req,res,next) => {
    const { id } = req.params
    const { name, locale } = req.body
    try {
        if(req.body.locale == 'en'){
            return res
                .status(400)
                .json({
                    success:false,
                    message:'You can not update this language'
                })        
        }
        
        await Lang.findByIdAndUpdate(id, req.body, {
            useFindAndModify:false
        })
        return res
            .status(200)
            .json({
                success:true,
                message:'Language updated successfuly'
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

