import express from "express";
import {
  register,
  login,
  getMe,
  updateUserProfile,
  changeUserPassword,
  adminLogin,
  changeAdminPassword,
  resetAdminPasswordMaster,
} from "../controllers/authController.js";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

// User Auth Endpoints
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authMiddleware, getMe);
authRouter.put("/profile", authMiddleware, updateUserProfile);
authRouter.put("/password", authMiddleware, changeUserPassword);

// Admin Auth Endpoints
authRouter.post("/admin/login", adminLogin);
authRouter.put("/admin/password", authMiddleware, adminMiddleware, changeAdminPassword);
authRouter.post("/admin/reset-password-master", resetAdminPasswordMaster);

export default authRouter;
