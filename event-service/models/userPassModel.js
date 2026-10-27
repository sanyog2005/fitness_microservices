import mongoose from "mongoose";

const userPassSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Decoupled User ID string
    passId: { type: mongoose.Schema.Types.ObjectId, ref: "Pass", required: true },
    runsRemaining: { type: Number, required: true },
    expiresAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["pending", "active", "exhausted", "expired", "cancelled"],
      default: "active",
    },
    customerEmail: { type: String, required: true },
    paymentStatus: { type: String, default: "paid" },
  },
  { timestamps: true }
);

const UserPass = mongoose.models.UserPass || mongoose.model("UserPass", userPassSchema);
export default UserPass;
