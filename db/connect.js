// load dependencies
const mongoose = require('mongoose')

// connect db function
const connectDB = async () => {
    try {
        // connect db
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser:true,
            useCreateIndex:true,
            useFindAndModify:true,
            useUnifiedTopology:true
        })
        // console if db connected
        console.log('db connected')
    } catch (error) {
        // console error if db not connected
        console.log('db not connected')
        process.exit(1)
    }
}

module.exports = connectDB