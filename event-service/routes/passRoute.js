import express from "express";
import {
  createPass,
  updatePass,
  deletePass,
  getAllPasses,
  purchasePass,
  getAllUserPasses,
  getMyPass,
  cancelUserPass,
  grantUserPass,
} from "../controllers/passController.js";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware.js";

const passRouter = express.Router();

// Admin Pass Types CRUD
passRouter.post("/", authMiddleware, adminMiddleware, createPass);
passRouter.put("/:id", authMiddleware, adminMiddleware, updatePass);
passRouter.delete("/:id", authMiddleware, adminMiddleware, deletePass);
passRouter.get("/admin/user-passes", authMiddleware, adminMiddleware, getAllUserPasses);
passRouter.put("/admin/cancel/:id", authMiddleware, adminMiddleware, cancelUserPass);
passRouter.post("/admin/grant", authMiddleware, adminMiddleware, grantUserPass);

// Public & User
passRouter.get("/", getAllPasses);
passRouter.post("/purchase", purchasePass);
passRouter.get("/my-pass", getMyPass);

export default passRouter;
