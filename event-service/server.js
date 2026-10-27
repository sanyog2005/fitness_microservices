import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import eventRouter from "./routes/eventRoutes.js";
import passRouter from "./routes/passRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1002;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/events", eventRouter);
app.use("/api/passes", passRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ service: "event-service", status: "healthy", port: PORT, time: new Date() });
});

// Start service
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 [Event Service] Running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`❌ [Event Service] Failed to start:`, error.message);
    process.exit(1);
  }
};

startServer();
