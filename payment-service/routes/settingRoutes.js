import express from "express";
import { getSettings, updateSetting } from "../controllers/settingController.js";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware.js";

const settingRouter = express.Router();

settingRouter.get("/", getSettings);
settingRouter.post("/", authMiddleware, adminMiddleware, updateSetting);

export default settingRouter;
