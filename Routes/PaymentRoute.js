const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require('../Model/paymentData');

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const jwt=require('jsonwebtoken')
function verifytoken(req,res,next){
    let token=req.headers.token;
    try{
    if(!token) throw 'Unauthorized access';
    else{
        let payload=jwt.verify(token,'secretkey');
        if(!payload) throw 'Unauthorized access';
        next()
    }
}  catch(error) {
    console.log(error);

}
}

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//  Create Order API 
router.post("/create-order",verifytoken ,async (req, res) => {
    console.log("Request Body :",req.body)
    try {
        const { amount, userId } = req.body; // Amount in INR

        const options = {
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Save "Pending" Payment in DB
        const payment = new Payment({
            userId,
            orderId: order.id,
            amount,
            status: "Pending",
        });

        await payment.save();

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        console.log(error)
    }
});

//  Verify Payment 
router.post("/paymentVerification",verifytoken, async (req, res) => {
    console.log("🟢 Received Payment Verification Data:", req.body);
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            // Update Payment Status in DB
            await Payment.findOneAndUpdate(
                { orderId: razorpay_order_id },
                { paymentId: razorpay_payment_id, signature: razorpay_signature, status: "Paid" }
            );

            res.json({ success: true, message: "Payment verified and saved!" });
        } else {
            res.status(400).json({ success: false, message: "Payment verification failed!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

//  Get User Payment History
router.get("/my-payments/:userId", verifytoken,async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch payments" });
    }
});

module.exports = router;
