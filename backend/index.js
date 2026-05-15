const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedLocalOrigins = [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/, process.env.FRONTEND_URL];

//Middleware
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedLocalOrigins.some((pattern) => pattern.test(origin))) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials:true    
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Routes
app.use('/api/auth', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/analytics',analyticsRoutes)


app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})
