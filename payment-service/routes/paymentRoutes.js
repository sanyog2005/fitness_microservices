import express from "express";
import { createCheckoutSession, verifyRazorpayPayment } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-checkout-session", createCheckoutSession);
paymentRouter.post("/verify-payment", verifyRazorpayPayment);

export default paymentRouter;
