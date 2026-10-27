import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/orderModel.js";

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    console.warn("⚠️ Razorpay credentials not configured in Payment Service.");
  }

  return new Razorpay({
    key_id: key_id || "rzp_test_placeholder",
    key_secret: key_secret || "placeholder_secret",
  });
};

// @desc Create Razorpay Checkout Order
export const createCheckoutSession = async (req, res) => {
  try {
    const {
      amount,
      currency = "INR",
      receipt,
      itemType,
      itemId,
      customerEmail,
      customerName,
      customerPhone,
    } = req.body;

    if (!amount || !customerEmail) {
      return res.status(400).json({ success: false, message: "Amount and customerEmail are required." });
    }

    const razorpay = getRazorpayInstance();
    const receiptId = receipt || `rcpt_${Date.now()}`;

    // Razorpay requires amount in smallest currency sub-unit (paise for INR)
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: currency.toUpperCase(),
      receipt: receiptId,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save initial order in Payments database
    const order = await Order.create({
      orderId: razorpayOrder.id,
      receipt: receiptId,
      userId: req.user?.userId || "guest",
      customerName: customerName || "",
      customerEmail,
      customerPhone: customerPhone || "",
      amount: Number(amount),
      currency: options.currency,
      itemType: itemType || "event",
      itemId: itemId || "",
      status: "created",
    });

    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      dbOrderId: order._id,
    });
  } catch (error) {
    console.error("Payment Order Creation Error:", error);
    res.status(500).json({ success: false, message: "Failed to initiate payment", error: error.message });
  }
};

// @desc Verify Razorpay Payment Signature
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing required payment verification parameters." });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const order = await Order.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          status: "paid",
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          paymentDetails: req.body,
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Payment verified successfully.",
        order,
      });
    } else {
      await Order.findOneAndUpdate({ orderId: razorpay_order_id }, { status: "failed" });
      res.status(400).json({ success: false, message: "Invalid payment signature." });
    }
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed", error: error.message });
  }
};
