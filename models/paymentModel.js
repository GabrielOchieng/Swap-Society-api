import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  paymentIntentId: {
    // Replace with your payment provider's identifier
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "paid", "failed", "cancelled"],
    default: "pending",
  },
  method: {
    type: String,
    required: true,
  }, // e.g., "stripe", "paypal"
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
