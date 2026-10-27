import express from "express";
import {
  createCoupon,
  getAllCoupons,
  toggleCouponStatus,
  deleteCoupon,
  validateCoupon,
} from "../controllers/couponController.js";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware.js";

const couponRouter = express.Router();

couponRouter.post("/validate", validateCoupon);

// Admin Coupon Management
couponRouter.post("/", authMiddleware, adminMiddleware, createCoupon);
couponRouter.get("/", authMiddleware, adminMiddleware, getAllCoupons);
couponRouter.put("/:id/toggle", authMiddleware, adminMiddleware, toggleCouponStatus);
couponRouter.delete("/:id", authMiddleware, adminMiddleware, deleteCoupon);

export default couponRouter;
