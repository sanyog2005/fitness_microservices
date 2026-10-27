import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/adminModel.js";
import { connectDB } from "./config/db.js";

dotenv.config();

async function seedAdmin() {
  try {
    console.log("Connecting to Auth database...");
    await connectDB();

    const email = process.env.ADMIN_EMAIL || "admin@arise.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      console.log(`ℹ️ Admin user already exists: ${email}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      name: "Super Admin",
      email: email,
      password: hashedPassword,
      role: "admin",
      permissions: ["all"],
    });

    await newAdmin.save();
    console.log(`✅ Admin successfully created in fitness_auth!`);
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to seed admin:", err.message);
    process.exit(1);
  }
}

seedAdmin();
