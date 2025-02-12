const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Link to User
    orderId: { type: String, required: true }, // Razorpay Order ID
    paymentId: { type: String }, // Razorpay Payment ID
    signature: { type: String }, // Razorpay Signature
    amount: { type: Number, required: true }, // Amount in INR
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" }, // Payment Status
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
