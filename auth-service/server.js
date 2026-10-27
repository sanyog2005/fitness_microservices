import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1001;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Microservice Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ service: "auth-service", status: "healthy", port: PORT, time: new Date() });
});

// Start service
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 [Auth Service] Running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`❌ [Auth Service] Failed to start:`, error.message);
    process.exit(1);
  }
};

startServer();
