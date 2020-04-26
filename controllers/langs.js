const Lang = require('../models/Lang')
const fs = require('fs')
const langs = require('../localization/langs.json')
const en = require('../localization/locales/en.json')
// get all langs
exports.getLangs = async (req,res,next) => {
    try {
        // const langs = await Lang.find()
        let langsArr = [] 
        for (let [key, value] of Object.entries(langs)) {
            let obj = {locale:key, name: value};
            langsArr.push(obj)
          }
        return res
            .status(200)
            .json({
                success:true,
                count:langsArr.length,
                langs:langsArr
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

exports.getLang = async (req,res,next) => {
    
}

// add a new lang
exports.addLang = async (req,res,next) => {
    const { locale, name } = req.body
    try {
        // const data = await Lang.findOne({name:req.body.name})
        let langsNames = [] 
        let langsLocales = [] 
        for (let [key, value] of Object.entries(langs)) {
            langsNames.push(value)
            langsLocales.push(key)
        }
        // check if name existed
        if(langsNames.includes(name)){
            return res
            .status(400)
            .json({
                success:true,
                message:'Lang already existed with this name'
            })
        }
        // check if locale existed
        if(langsLocales.includes(locale)){
            return res
            .status(400)
            .json({
                success:true,
                message:'Lang already existed with this locale'
            })
        }

        langs[locale] = name

        let json = JSON.stringify(langs);
        fs.appendFileSync(`../server/localization/locales/${locale}.json`, JSON.stringify(en))
        // fs.writeFileSync
        fs.writeFileSync('../server/localization/langs.json', json, function(err){
            console.log(err)
        });
        // const lang = await Lang.create(req.body)
        return res
            .status(200)
            .json({
                success:true,
                message:'Lang added successfuly'
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


// delete lang
exports.deleteLang = async (req,res,next) => {
    const { locale } = req.params
    console.log(locale)
    try {
        // const lang = await Lang.findById(id)
        // await lang.remove()
        if(locale == 'en'){
            return res
            .status(400)
            .json({
                success:true,
                message:'This Language Can not be deleted'
            })
        }
        const json = langs
        delete json[locale]
        fs.writeFileSync('../server/localization/langs.json', JSON.stringify(json), function(err){
            console.log(err)
        });
        fs.unlinkSync(`../server/localization/locales/${locale}.json`)
        console.log(json)
        return res
            .status(200)
            .json({
                success:true,
                message:'Lang deleted successfuly'
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


// update lang
exports.updateLang = async (req,res,next) => {
    const { locale } = req.params
    const newLocale = req.body.locale
    const newName = req.body.name
    try {
        // if locale is en then it can not be updated
        if(locale == 'en'){
            return res
            .status(400)
            .json({
                success:true,
                message:'This Language Can not be updated'
            })
        }
        // const lang = await Lang.findByIdAndUpdate(id, req.body)
        let newLangs = langs
        // get pre locale
        const preName = newLangs[locale]

        // if both are same then no need to update anything but send ok status
        if(newLocale == locale && newName == preName){
            return res
            .status(200)
            .json({
                success:true,
            })
        }

        // if locale is same but name is changed
        if(newLocale == locale && newName != preName){
            console.log('name is changed')
            newLangs[locale] = newName
            fs.writeFileSync('../server/localization/langs.json', JSON.stringify(newLangs), function(err){
                console.log(err)
            });
            console.log(newLangs)
            return res
            .status(200)
            .json({
                success:true,
            })
        }

        if(newLocale != locale && newName == preName){
            delete newLangs[locale]
            newLangs[newLocale] = newName
            fs.writeFileSync('../server/localization/langs.json', JSON.stringify(newLangs), function(err){
                console.log(err)
            });
            fs.rename(`../server/localization/locales/${locale}.json`,`../server/localization/locales/${newLocale}.json`, function(err){
                if(err){
                    console.log(err)
                }
            })
            return res
            .status(200)
            .json({
                success:true,
            })
        }

        if(newLocale != locale && newName != preName){
            delete newLangs[locale]
            newLangs[newLocale] = newName
            fs.writeFileSync('../server/localization/langs.json', JSON.stringify(newLangs), function(err){
                console.log(err)
            });
            fs.rename(`../server/localization/locales/${locale}.json`,`../server/localization/locales/${newLocale}.json`, function(err){
                if(err){
                    console.log(err)
                }
            })
            return res
            .status(200)
            .json({
                success:true,
            })
        }  


        return res
            .status(200)
            .json({
                success:true,
                message:'Lang updated successfuly'
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

