const Order = require('../models/Order')
const moment = require('moment')

// get all orders
exports.getOrders = async (req,res,next) => {
    try {
        const orders = await Order.find().populate('user')
        return res
            .status(200)
            .json({
                success:true,
                count:orders.length,
                data:orders
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

exports.getOrder = async (req,res,next) => {
    let { id } = req.params
    try {
        const order = await Order.findById(id).populate('user')
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

// add a new order
exports.addOrder = async (req,res,next) => {
    try {
        const order = await Order.create(req.body)
        return res
            .status(200)
            .json({
                success:true,
                message:'Order added successfuly'
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


// delete order
exports.deleteOrder = async (req,res,next) => {
    const { id } = req.params
    try {
        const order = await Order.findById(id)
        await order.remove()
        return res
            .status(200)
            .json({
                success:true,
                message:'Order deleted successfuly'
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


// update order
exports.updateOrder = async (req,res,next) => {
    const { id } = req.params
    try {
        const order = await Order.findByIdAndUpdate(id, req.body)
        return res
            .status(200)
            .json({
                success:true,
                message:'Order updated successfuly'
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



exports.getReports = async (req,res,next) => {
    try {

        // day Report
        let dayReport = {}
        // week Report
        let weekReport = {}
        // month Report
        let monthReport = {}
        // year Report
        let yearReport = {}

        // get day
        let day = {
            start: moment().startOf('day'),
            end: moment().endOf('day')
        }


        // get week
        let week = {
            start: moment().startOf('week'),
            end: moment().endOf('week')
        }
        // get month
        let month = {
            start: moment().startOf('month'),
            end: moment().endOf('month')
        }
        // get month
        let year = {
            start: moment().startOf('month'),
            end: moment().endOf('month')
        }

        // total orders
        let totalOrders = await Order.countDocuments()

        // generate day report
        let dayOrders = await Order.find({
            date: {$gt: day.start, $lt: day.end}
        }).select('amount products -_id')

        // generate weekly report
        let weekOrders = await Order.find({
            date: {$gt: week.start, $lt: week.end}
        }).select('amount products -_id')

        // generate month report
        let monthOrders = await Order.find({
            date: {$gt: month.start, $lt: month.end}
        }).select('amount products -_id')

        // generate year report
        let yearOrders = await Order.find({
            date: {$gt: year.start, $lt: year.end}
        }).select('amount products -_id')

        // generate day report
        let dayTotalAmount = 0
        let dayTotalProducts = 0
        dayOrders.map(order => {
            if(order.amount){
                dayTotalAmount += order.amount
                if(order.products){
                    order.products.map(product => {
                        dayTotalProducts += product.quantity
                    })
                }
            }
        })
        dayReport.totalAmount = dayTotalAmount
        dayReport.totalOrders = dayOrders.length
        dayReport.totalSales = dayTotalProducts

        // generate week report
        let weekTotalAmount = 0
        let weekTotalProducts = 0
        weekOrders.map(order => {
            if(order.amount){
                weekTotalAmount += order.amount
                if(order.products){
                    order.products.map(product => {
                        weekTotalProducts += product.quantity
                    })
                }
            }
        })
        weekReport.totalAmount = weekTotalAmount
        weekReport.totalOrders = weekOrders.length
        weekReport.totalSales = weekTotalProducts

        // generate month report
        let monthTotalAmount = 0
        let monthTotalProducts = 0
        monthOrders.map(order => {
            if(order.amount){
                monthTotalAmount += order.amount
                if(order.products){
                    order.products.map(product => {
                        monthTotalProducts += product.quantity
                    })
                }
            }
        })
        monthReport.totalAmount = monthTotalAmount
        monthReport.totalOrders = monthOrders.length
        monthReport.totalSales = monthTotalProducts

        // generate year report
        let yearTotalAmount = 0
        let yearTotalProducts = 0
        yearOrders.map(order => {
            if(order.amount){
                yearTotalAmount += order.amount
                if(order.products){
                    order.products.map(product => {
                        yearTotalProducts += product.quantity
                    })
                }
            }
        })
        yearReport.totalAmount = yearTotalAmount
        yearReport.totalOrders = yearOrders.length
        yearReport.totalSales = yearTotalProducts

        // all reports
        let reports = {
            dayReport,
            weekReport,
            monthReport,
            yearReport,
        }

        // get year record
        const allMonths = moment.months()
        const currentMonth = Number(moment().format("M"))
        let yearDates = []
        for (let i = 0; i < allMonths.length; i++){
            if(i == currentMonth){
                break
            }
            yearDates.push ({
                name:allMonths[i],
                start: moment().startOf('month').month(allMonths[i]),
                end: moment().endOf('month').month(allMonths[i])
            })
        }
        let yearRecords = {
            months: [],
            amounts: [],
            orders: [],
            sales: []
        }
        for(let i = 0; i < yearDates.length; i++){
            let orders = await Order.find({
                date: {$gt: yearDates[i].start, $lt: yearDates[i].end}
            }).select('amount products -_id')
            let amount = 0
            let productSales = 0
            if(orders){
                orders.map(order => {
                    if(order.amount){
                        amount += order.amount
                    }
                    if(order.products){
                        order.products.map(product => {
                            productSales += product.quantity
                        })
                    }
                })
            }
            yearRecords.months.push(yearDates[i].name)
            yearRecords.amounts.push(amount)
            yearRecords.orders.push(orders.length)
            yearRecords.sales.push(productSales)
        }
        
        // records for charts
        records = {
            yearRecords
        }

        const paypal = process.env.PAYPAL_CLIENT_ID

        return res
            .status(200)
            .json({
                status:true,
                totalOrders,
                reports,
                records,
                paypal
            })
    } catch (error) {
        return res
            .status(400)
            .json({
                status:false,
                message:error
            })
    }
}

