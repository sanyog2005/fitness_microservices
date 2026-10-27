import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
  verifyOTP,
  cancelRegistration,
} from "../controllers/eventController.js";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware.js";

const eventRouter = express.Router();

eventRouter.route("/")
  .get(getEvents)
  .post(authMiddleware, adminMiddleware, createEvent);

eventRouter.route("/:id")
  .get(getEventById)
  .put(authMiddleware, adminMiddleware, updateEvent)
  .delete(authMiddleware, adminMiddleware, deleteEvent);

eventRouter.route("/:id/registrations")
  .get(authMiddleware, adminMiddleware, getEventRegistrations);

eventRouter.route("/registrations/:id/verify-otp")
  .post(verifyOTP);

eventRouter.route("/registrations/:id/cancel")
  .post(cancelRegistration);

export default eventRouter;
