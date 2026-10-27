import express from "express";
import { getUserDashboard, getAllUsers } from "../controllers/userController.js";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/dashboard", authMiddleware, getUserDashboard);
userRouter.get("/admin/all-users", authMiddleware, adminMiddleware, getAllUsers);

export default userRouter;
