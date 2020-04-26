// load dependencies
const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')
const fileUpload = require('express-fileupload')


// load env vars
dotenv.config({ path: './config/config.env' })

// load routes
const Users = require('./routes/users') 
const Auth = require('./routes/auth') 
const Cats = require('./routes/cat') 
const Products = require('./routes/products') 
const Payments = require('./routes/payments') 
const Carts = require('./routes/cart') 
const Orders = require('./routes/orders') 
const Slider = require('./routes/slider') 
const Images = require('./routes/images') 
const Icons = require('./routes/icons') 
const Langs = require('./routes/langs') 
const Languages = require('./routes/languages')
const Translations = require('./routes/translations')
const Settings = require('./routes/settings')
const Notifications = require('./routes/notifications')

// load db
const connectDB = require('./db/connect')

// initialize app
const app = express()

// connect db
connectDB()


//**** MIDDLEWARES ****//
// body parser middleware
app.use(express.json())
// path middleware
app.use(express.static(path.join(__dirname, 'public')))
// cors middleware
app.use(cors())
// express fileupload middleware
app.use(fileUpload());

// initialize routes
app.use('/api/users', Users)
app.use('/api/auth', Auth)
app.use('/api/categories', Cats)
app.use('/api/products', Products)
app.use('/api/payments', Payments)
app.use('/api/cart', Carts)
app.use('/api/orders', Orders)
app.use('/api/sliders', Slider)
app.use('/api/images', Images)
app.use('/api/icons', Icons)
app.use('/api/langs', Langs)
app.use('/api/languages', Languages)
app.use('/api/translations', Translations)
app.use('/api/settings', Settings)
app.use('/api/notifications', Notifications)

// handle productios
if(process.env.NODE_ENV == 'production'){
    app.use(express.static(__dirname+'/public/'))

    // send public/html for every rouote
    app.get(/.*/, (req,res) => res.sendFile(__dirname+'/public/index.html'))
}

// listen server on port
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`App started on the port ${PORT}`))