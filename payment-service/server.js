import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import paymentRouter from "./routes/paymentRoutes.js";
import couponRouter from "./routes/couponRoutes.js";
import settingRouter from "./routes/settingRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1004;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/payments", paymentRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/settings", settingRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ service: "payment-service", status: "healthy", port: PORT, time: new Date() });
});

// Start service
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 [Payment Service] Running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`❌ [Payment Service] Failed to start:`, error.message);
    process.exit(1);
  }
};

startServer();
