const Cart = require('../models/Cart')
const Product = require('../models/Product')

// get cart products
exports.getProducts = async (req,res,next) => {
    const { userId } = req.params
    try {
        let cart = await Cart.findOne({user:userId}).populate('products.product')
        let item = {}
        let data = cart.products.filter(product => product.product).map((product) => {
                item = {
                    name:product.product.name,
                    _id:product.product._id,
                    avatar:product.product.avatar,
                    description:product.product.description,
                    price:product.product.price,
                    quantity:product.quantity
                }
            return item
        })
        // delete the products from cart which are null or deleted by the admin
        cart.products.filter(product => !product.product).map((product,index) => cart.products.splice(index, 1) )
        await cart.save()
        return res
            .status(200)
            .json({
                success:true,
                data
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

// add product to cart
exports.addProduct = async (req,res,next) => {
    const { userId } = req.params
    try {
        let cart = await Cart.findOne({user:userId}).populate('products.product')
        if(cart){
            let productIndex = cart.products.filter(product => product.product).findIndex(product => product.product._id == req.body._id)
            if(productIndex != -1){
                cart.products[productIndex].quantity += 1
            }else{
                let product = {
                    quantity:req.body.quantity,
                    product:req.body._id
                }
                cart.products.push(product)
            }
            await cart.save()
        }else{
            return res
                .status(400)
                .json({
                    success:false,
                    message:'Cart not found'
                })
        }
        return res
            .status(200)
            .json({
                success:false,
                message:'Product Add to the cart successfuly'
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

// remove product from cart
exports.removeProduct = async (req,res,next) => {
    const { userId, productId } = req.params
    try {
        let cart = await Cart.findOne({user:userId})
        let productIndex = cart.products.filter(product => product.product).findIndex(product => product.product == productId)
        if(productIndex != -1){
            cart.products.splice(productIndex, 1)
        }
        await cart.save()
        return res
            .status(200)
            .json({
                success:true
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

// empty the cart
exports.emptyCart = async (req,res,next) => {
    const { userId } = req.params
    try {
        let cart = await Cart.findOne({user:userId})
        cart.products = []
        await cart.save()
        return res
            .status(200)
            .json({
                success:true,
                message:'Cart is empty now'
            })
    } catch (error) {
        return res
            .status(200)
            .json({
                success:true,
                message:error
            })
    }
}

// increase or decrease quantity
exports.changeQty = async (req,res,next) => {
    const { userId, productId } = req.params
    const { type, value } = req.body
    try {
        let cart = await Cart.findOne({user:userId})
        let productIndex = cart.products.filter(product => product.product).findIndex(product => product.product == productId)
        if(productIndex != -1){
            if(type == 'increase'){
                cart.products[productIndex].quantity += value
            }else{
                cart.products[productIndex].quantity -= value
            }
        }
        await cart.save()
        return res
            .status(200)
            .json({
                success:true,
                message:`Quantity ${type} successful`
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