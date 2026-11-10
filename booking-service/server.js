import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import productRouter from "./routes/productRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import SystemMonitor from "./utils/systemMonitor.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1003;
const monitor = new SystemMonitor("fitness-booking-service");

// Allowed Origins for CORS
const allowedOrigins = [
  "https://one9-frontend.vercel.app",
  "https://one9-admin.vercel.app",
  "https://one9-blond.vercel.app",
  "http://localhost:5175",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://fitness-payment-service.onrender.com",
  "https://fitness-event-service.onrender.com",
  "https://fitness-booking-service.onrender.com",
  "https://fitness-auth-service.onrender.com",
  "https://fitness-api-gateway-xqof.onrender.com",
  "https://app.ariserunclubb.com",
  "https://admin.ariserunclubb.com",
  "https://www.ariserunclubb.com",
  "https://ariserunclubb.com",
];

// Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.includes("localhost:")
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy does not allow access from this origin."));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "DNT",
      "User-Agent",
      "X-Requested-With",
      "If-Modified-Since",
      "Cache-Control",
      "Content-Type",
      "Range",
      "Authorization",
      "Pragma",
    ],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(morgan("combined", { stream: monitor.morganStream }));

// Monitoring routes (accessible via Gateway /api/bookings/monitoring or directly)
monitor.attachRoutes(app, "/api/bookings/monitoring");

// Routes
app.use("/api/products", productRouter);
app.use("/api/cars", productRouter); // Legacy alias support
app.use("/api/bookings", bookingRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({
    service: "fitness-booking-service",
    status: "healthy",
    port: PORT,
    uptime: Math.floor(process.uptime()),
    time: new Date(),
  });
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
