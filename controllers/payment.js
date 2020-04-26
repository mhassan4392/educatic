const uuid = require('uuid')
const Setting = require('../models/Setting')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Order = require('../models/Order')
const Notification = require('../models/Notification')
const User = require('../models/User')
const Product = require('../models/Product')
const sendMail = require('../utils/sendMail')
exports.payWithCard = async (req,res,next) => {
    const {source, token, amount, email, user, products, address} = req.body
    let idempotencyKey = uuid.v4()     
        try {
            let customer = await stripe.customers.create({
                email:email,
                source:token.id
            })
           
            let result = await stripe.charges.create({
                customer:customer.id,
                amount:amount * 100,
                currency:'usd'
            }, {idempotencyKey})
    
            const data = {
                data:result,
                user,
                payment:'stripe',
                products,
                address,
                amount,
                type:'physical'
            }


            products.map(async (item) => {
                let product = await Product.findOne({_id:item._id})
                product.sales += item.quantity
                await product.save()
            })
            let ids = products.map(item => item._id)
            let saledProducts = await Product.find({_id:{$in:ids}})
            
            // create the order
            let order = await Order.create(data)

            // create notifications
            let users = await User.find({role:'admin'}).select('_id email')
            users.map( async (user) => {
                let payload = {
                    user:user._id,
                    data:order._id,
                    type:'order'
                }
                await Notification.create(payload)

                const options = {
                    email:user.email,
                    subject:'New Order',
                    message:`You Have Recieved a New Order Please visit You Dashboard ${req.protocol}://${req.get('host')}/dashboard` 
                }
    
                await sendMail(options)
            })

            return res
            .status(200)
            .json({
                success:true,
                data:result,
                order
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


exports.payWithCardDigital = async (req,res,next) => {
    const {source, token,product, amount, email, user, products} = req.body
    let idempotencyKey = uuid.v4()     
        try {
            let customer = await stripe.customers.create({
                email:email,
                source:token.id
            })
           
            let result = await stripe.charges.create({
                customer:customer.id,
                amount:amount * 100,
                currency:'usd'
            }, {idempotencyKey})
    
            const data = {
                data:result,
                user,
                payment:'stripe',
                products,
                amount,
                type:'digital'
            }

            products.map(async (item) => {
                let product1 = await Product.findById(item._id)
                product1.sales += 1
                product1.buyers.push(user)
                await product1.save()
            })

            //send link to user
        let options = {
            email:email,
            subject:'Buy a Link',
            message:product.link 
        }
         await sendMail(options)
            let ids = products.map(item => item._id)
            let saledProducts = await Product.find({_id:{$in:ids}})
            
            // create the order
            let order = await Order.create(data)

            // create notifications
            let users = await User.find({role:'admin'}).select('_id email')
            users.map( async (user) => {
                let payload = {
                    user:user._id,
                    data:order._id,
                    type:'order'
                }
                await Notification.create(payload)

                const options = {
                    email:user.email,
                    subject:'New Order',
                    message:`You Have Recieved a New Order Please visit You Dashboard ${req.protocol}://${req.get('host')}/dashboard` 
                }
    
                await sendMail(options)
            })

            return res
            .status(200)
            .json({
                success:true,
                data:result,
                order
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

exports.payWithPaypal = async (req,res,next) => {
    const { user, products, amount, data, address } = req.body
    try {
        const payload = {
            data,
            user,
            payment:'paypal',
            products,
            address,
            amount,
            type:'physical'
        }
        // create the order
        let order = await Order.create(payload)

        products.map(async (item) => {
            let product1 = await Product.findOne({_id:item._id})
            product1.sales += item.quantity
            product1.buyers.push(user)
            await product1.save()
        })

        // create notifications
        let users = await User.find({role:'admin'}).select('_id email')
        users.map( async (user) => {
            let payload = {
                user:user._id,
                data:order._id,
                type:'order'
            }
            await Notification.create(payload)

            const options = {
                email:user.email,
                subject:'New Order',
                message:`You Have Recieved a New Order Please visit You Dashboard ${req.protocol}://${req.get('host')}/dashboard` 
            }

            await sendMail(options)
        })

        return res
            .status(200)
            .json({
                success:true,
                order
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


exports.payWithPaypalDigital = async (req,res,next) => {
    const { user, products,product, email, amount, data } = req.body
    try {
        const payload = {
            data,
            user,
            payment:'paypal',
            products,
            amount,
            type:'digital',
        }
        // create the order
        let order = await Order.create(payload)

        products.map(async (item) => {
            let product1 = await Product.findById(item._id)
            product1.sales += 1
            product1.buyers.push(user)
             
            await product1.save()
        })

        //send link to user
        let options = {
            email:email,
            subject:'Buy a Link',
            message:product.link 
        }
         await sendMail(options)

        // create notifications
        let users = await User.find({role:'admin'}).select('_id email')
        users.map( async (user) => {
            let payload = {
                user:user._id,
                data:order._id,
                type:'order'
            }
            await Notification.create(payload)

            const options = {
                email:user.email,
                subject:'New Order',
                message:`You Have Recieved a New Order Please visit You Dashboard ${req.protocol}://${req.get('host')}/dashboard` 
            }

            await sendMail(options)
        })

        return res
            .status(200)
            .json({
                success:true,
                order
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

exports.getKey = async (req,res,next) => {
    try {
        const { type } = req.body
        let key = ''
        if(type == 'paypal'){
            key = process.env.PAYPAL_CLIENT_ID
        }
        if(type == 'stripe'){
            key = process.env.STRIPE_PUBLISH_KEY
        }
        return res
            .status(200)
            .json({
                key
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