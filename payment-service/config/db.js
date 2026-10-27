import mongoose from "mongoose";
import dns from "dns";

// Use Google DNS to ensure SRV records for MongoDB Atlas resolve reliably across all OS/Docker networks
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB || "fitness_payments";

    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is missing.");
    }

    const conn = await mongoose.connect(mongoUri, {
      dbName: dbName,
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`✅ [Payment Service] Connected to MongoDB: ${conn.connection.host} | Database: ${dbName}`);
  } catch (error) {
    console.error(`❌ [Payment Service] Database connection error: ${error.message}`);
    process.exit(1);
  }
};
