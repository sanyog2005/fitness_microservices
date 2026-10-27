import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true }, // Razorpay order_id
    receipt: { type: String, required: true },
    userId: { type: String, default: "guest" },
    customerName: { type: String, default: "" },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, default: "" },
    amount: { type: Number, required: true }, // In INR
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    itemType: {
      type: String,
      enum: ["event", "pass", "booking", "merchandise"],
      default: "event",
    },
    itemId: { type: String, default: "" },
    paymentId: { type: String, default: "" }, // Razorpay payment_id
    signature: { type: String, default: "" },
    paymentDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
