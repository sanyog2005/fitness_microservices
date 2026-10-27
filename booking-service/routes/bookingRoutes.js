import express from "express";
import {
  createBooking,
  getBookings,
  getMyBookings,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/bookingController.js";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware.js";

const bookingRouter = express.Router();

bookingRouter.post("/", authMiddleware, createBooking);
bookingRouter.get("/", authMiddleware, adminMiddleware, getBookings);
bookingRouter.get("/mybooking", authMiddleware, getMyBookings);
bookingRouter.put("/:id", authMiddleware, updateBooking);
bookingRouter.patch("/:id/status", authMiddleware, adminMiddleware, updateBookingStatus);
bookingRouter.delete("/:id", authMiddleware, adminMiddleware, deleteBooking);

export default bookingRouter;
