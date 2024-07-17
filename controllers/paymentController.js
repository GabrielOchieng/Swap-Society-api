import asyncHandler from "express-async-handler";
import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";

// Create a payment (protected route)
const createPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentIntentId, amount, method } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  // Validate payment details and amount against order (implement logic here)

  const payment = new Payment({
    orderId,
    paymentIntentId,
    amount,
    method,
  });

  const createdPayment = await payment.save();
  res.status(201).json(createdPayment);
});

// Get payment details by ID (protected route - accessible for order-related users)
const getPaymentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const payment = await Payment.findById(id).populate(
    "orderId",
    "buyer seller"
  ); // Populate buyer and seller details

  if (!payment) {
    res.status(404).json({ message: "Payment not found" });
    return;
  }

  // Check if user has access to this payment based on order or role (implement logic here)

  res.status(200).json(payment);
});

export { createPayment, getPaymentById };
