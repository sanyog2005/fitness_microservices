import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import productRouter from "./routes/productRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1003;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/products", productRouter);
app.use("/api/cars", productRouter); // Legacy alias support
app.use("/api/bookings", bookingRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ service: "booking-service", status: "healthy", port: PORT, time: new Date() });
});

// Start service
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 [Booking Service] Running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`❌ [Booking Service] Failed to start:`, error.message);
    process.exit(1);
  }
};

startServer();
