const Cat = require('../models/Category')

// get all cats
exports.getCats = async (req,res,next) => {
    try {
        const cats = await Cat.find()
        return res
            .status(200)
            .json({
                success:true,
                count:cats.length,
                cats
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

// add a new cat
exports.addCat = async (req,res,next) => {
    try {
        const data = await Cat.findOne({name:req.body.name})
        if(data){
            return res
            .status(400)
            .json({
                success:true,
                message:'Category already existed with this name'
            })
        }
        const cat = await Cat.create(req.body)
        return res
            .status(200)
            .json({
                success:true,
                message:'Category added successfuly'
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


// delete cat
exports.deleteCat = async (req,res,next) => {
    const { id } = req.params
    try {
        const cat = await Cat.findById(id)
        await cat.remove()
        return res
            .status(200)
            .json({
                success:true,
                message:'Category deleted successfuly'
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


// update cat
exports.updateCat = async (req,res,next) => {
    const { id } = req.params
    try {
        const cat = await Cat.findByIdAndUpdate(id, req.body)
        return res
            .status(200)
            .json({
                success:true,
                message:'Category updated successfuly'
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

