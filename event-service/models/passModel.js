import mongoose from "mongoose";

const passSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    price: { type: Number, required: true },
    runsIncluded: { type: Number, required: true },
    validityWeeks: { type: Number, default: 0 }, // 0 means no expiry
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Pass = mongoose.models.Pass || mongoose.model("Pass", passSchema);
export default Pass;
