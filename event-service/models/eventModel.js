import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "", trim: true },
    targetDate: { type: Date, required: true },
    routeImage: { type: String, default: "" },
    routeTitle: { type: String, required: true, trim: true },
    routeDescription: { type: String, default: "" },
    location: { type: String, required: true, trim: true },
    startTimeText: { type: String, default: "" },
    distancePace: { type: String, default: "" },
    requirements: { type: [String], default: [] },
    spotsRemaining: { type: Number, required: true, min: 0, default: 50 },
    price: { type: Number, required: true, min: 0 },
    isPassEligible: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

eventSchema.index({ targetDate: 1, status: 1 });

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
export default Event;
