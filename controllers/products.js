const Product = require('../models/Product')
const path = require('path')
const crypto = require('crypto')
const fs = require('fs')
// get all Products
exports.getProducts = async (req,res,next) => {
    try {
        let query = JSON.parse(req.query.payload)
        let page = query.page || 1
        let limit = query.limit || 5
        let startIndex = (page - 1) * limit
        // fields to remove from query
        const remQuery = ['limit', 'page']
        remQuery.forEach(param => delete query[param])
        const total = await Product.countDocuments(query)
        const products = await Product.find(query).populate('user').populate('reviews.user', ['name', 'avatar', 'date']).populate('category').skip(startIndex).limit(limit)
        return res
            .status(200)
            .json({
                success:true,
                count:products.length,
                products,
                total
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

// get all Product
exports.getProduct = async (req,res,next) => {
    const id = req.params.id
    try {
        const product = await Product.findById(id).populate('reviews.user', ['name', 'avatar', 'date']).populate('category').populate('user')
        return res
            .status(200)
            .json({
                success:true,
                product
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

// add review to product
exports.addReview = async (req,res,next) => {
    const { productId , userId } = req.params
    const { feedback , rating } = req.body
    try {
        const product = await Product.findById(productId)

        const reviewId = crypto.randomBytes(16).toString("hex");
        const review = {
            feedback,
            rating,
            user:userId
        }
        product.reviews.push(review)
        await product.save()
        return res
            .status(200)
            .json({
                success:true,
                message:'Review add successfully'
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

// add a new Product
exports.addProduct = async (req,res,next) => {
    let newProduct = req.body
    try {
        let product = await Product.findOne({name:req.body.name})
        if(product){
            return res
                .status(400)
                .json({
                    success:true,
                    message:'Product already existed with this name'
                })
        }
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
            if(!fs.existsSync(process.env.FILE_UPLOAD_LOACTION+'/products')){
                fs.mkdirSync(process.env.FILE_UPLOAD_LOACTION+'/products')
            }
            avatar.name = `product_${req.body.name}${path.parse(avatar.name).ext}`
            avatar.mv(`${process.env.FILE_UPLOAD_LOACTION}/products/${avatar.name}`, err => {
                if(err){
                    return res
                        .status(400)
                        .json({
                            success:false,
                            message:err
                        })
                }
            })
            newProduct.avatar = avatar.name
        }
        product = await Product.create(newProduct)
        return res
            .status(200)
            .json({
                success:true,
                message:'Product added successfuly'
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


// delete Product
exports.deleteProduct = async (req,res,next) => {
    const { id } = req.params
    try {
        const product = await Product.findById(id)
        let avatar = process.env.FILE_UPLOAD_LOACTION+'/products/'+product.avatar
        if(fs.existsSync(avatar)){
            fs.unlinkSync(avatar)
        }
        await product.remove()
        return res
            .status(200)
            .json({
                success:true,
                message:'Product deleted successfuly'
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


// update Product
exports.updateProduct = async (req,res,next) => {
    const { id } = req.params
    const updateProduct = req.body
    
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
            if(!fs.existsSync(process.env.FILE_UPLOAD_LOACTION+'/products')){
                fs.mkdirSync(process.env.FILE_UPLOAD_LOACTION+'/products')
            }
            let product = await Product.findById(id)
            let preAvatar = process.env.FILE_UPLOAD_LOACTION+'/products/'+product.avatar
            if(fs.existsSync(preAvatar)){
                fs.unlinkSync(preAvatar)
            }
            avatar.name = `product_${req.body.name}${path.parse(avatar.name).ext}`
            avatar.mv(`${process.env.FILE_UPLOAD_LOACTION}/products/${avatar.name}`, err => {
                if(err){
                    return res
                        .status(400)
                        .json({
                            success:false,
                            message:err
                        })
                }
            })
            updateProduct.avatar = avatar.name
        }
        await Product.findByIdAndUpdate(id, updateProduct)
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

exports.topSellingProducts = async (req,res,next) => {
    try {
        let products = await Product.find().sort('-sales').limit(10)
        return res
            .status(200)
            .json({
                success:true,
                products
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

