const Product = require('../model/product')
const User = require('../model/user')
const Order = require('../model/order')

const getAdminStats = async(req,res)=>{
    try{
        const totalUsers = await User.countDocuments({role:'user'});
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});
        
        const orders = await Order.find({});

        const totalRevenueData = orders.reduce((acc,order)=>acc+(order.totalAmount || 0), 0);

        res.json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue: totalRevenueData
        });
    }catch(error){
        console.log(error.message)
        res.status(500).json({message:"server error"});
    }
};

module.exports = {getAdminStats};
