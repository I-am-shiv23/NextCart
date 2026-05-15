const razorpay = require("../config/razorpay")
const crypto = require('crypto')
dotenv = require("dotenv").config();

const createdOrder  = async(req, res)=>{
    try{
     const options = {
        amount: req.body.amount * 100,
        currency:"INR",
        receipt: crypto.randomBytes(10).toString("hex")
     };
     const order = await razorpay.orders.create(options);
     res.status(200).json(order);
    }catch(error){
      console.log(error)    
    }
}
const verifyPayment = async(req, res)=>{
    try{
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
        const generated_signature = crypto.createHmc("sha256", process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id+" "+razorpay_payment_id).digest('hex');
        if(generated_signature === razorpay_signature){
            res.status(200).json({message: "Payment verified successfully"});
        }else{
            res.status(400).json({message: "Payment verification failed"});
        }                                                                               
    }catch(error){
        console.log(error)
    }
}

module.exports = {createdOrder, verifyPayment};