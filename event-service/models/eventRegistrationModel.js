import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "" }, // Decoupled User ID string
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    customer: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    alias: { type: String, default: "Runner" },
    emergencyContact: { type: String, default: "" },
    emergencyPhone: { type: String, default: "" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
    otp: { type: String, default: "" },
    isAttended: { type: Boolean, default: false },
    attendedAt: { type: Date, default: null },
    passName: { type: String, default: "" },
    amount: { type: Number, required: true, min: 0 },
    ticketType: { type: String, default: "Event Ticket" },
    paymentId: { type: String, default: "" },
    paymentDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const EventRegistration =
  mongoose.models.EventRegistration || mongoose.model("EventRegistration", eventRegistrationSchema);
export default EventRegistration;
