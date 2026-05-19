const razorpay = require("../config/razorpay");
const crypto = require("crypto");

const isRazorpayConfigured = () =>
    process.env.RAZORPAY_KEY_ID?.startsWith("rzp_") && process.env.RAZORPAY_KEY_SECRET;

const createdOrder  = async(req, res)=>{
    if (!isRazorpayConfigured()) {
        return res.status(500).json({
            message: "Razorpay keys are missing or invalid. Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env, then restart the server.",
        });
    }

    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "A valid payment amount is required." });
    }

    try{
     const options = {
        amount: Math.round(amount * 100),
        currency:"INR",
        receipt: crypto.randomBytes(10).toString("hex")
     };
     const order = await razorpay.orders.create(options);
     res.status(200).json({
        ...order,
        keyId: process.env.RAZORPAY_KEY_ID,
     });
    }catch(error){
      console.error("Razorpay order error:", error);
      res.status(500).json({
        message:
            error?.error?.description ||
            "Payment order could not be created. Check Razorpay credentials in backend/.env.",
      });
    }
}
const verifyPayment = async(req, res)=>{
    if (!process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({
            message: "Razorpay secret is missing. Check RAZORPAY_KEY_SECRET in backend/.env.",
        });
    }

    try{
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({message: "Payment verification details are missing"});
        }

        const generated_signature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id+"|"+razorpay_payment_id).digest('hex');
        if(generated_signature === razorpay_signature){
            res.status(200).json({message: "Payment verified successfully"});
        }else{
            res.status(400).json({message: "Payment verification failed"});
        }                                                                               
    }catch(error){
        console.error("Razorpay verification error:", error);
        res.status(500).json({message: "Payment verification failed"});
    }
}

module.exports = {createdOrder, verifyPayment};
