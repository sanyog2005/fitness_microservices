import Event from "../models/eventModel.js";
import EventRegistration from "../models/eventRegistrationModel.js";

// @desc Create Event
export const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    const savedEvent = await event.save();
    res.status(201).json({ success: true, data: savedEvent });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to create event", error: error.message });
  }
};

// @desc Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ targetDate: 1 });
    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch events", error: error.message });
  }
};

// @desc Get event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch event", error: error.message });
  }
};

// @desc Update Event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to update event", error: error.message });
  }
};

// @desc Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete event", error: error.message });
  }
};

// @desc Get Registrations for an Event
export const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ eventId: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch registrations", error: error.message });
  }
};

// @desc Verify runner OTP / QR code check-in
export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const registration = await EventRegistration.findById(req.params.id);
    if (!registration) return res.status(404).json({ success: false, message: "Registration not found" });

    if (registration.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid check-in code" });
    }

    registration.isAttended = true;
    registration.attendedAt = new Date();
    await registration.save();

    res.json({ success: true, message: "Check-in verified successfully", data: registration });
  } catch (error) {
    res.status(500).json({ success: false, message: "Check-in verification failed", error: error.message });
  }
};

// @desc Cancel Registration
export const cancelRegistration = async (req, res) => {
  try {
    const registration = await EventRegistration.findById(req.params.id);
    if (!registration) return res.status(404).json({ success: false, message: "Registration not found" });

    registration.status = "cancelled";
    await registration.save();

    res.json({ success: true, message: "Registration cancelled", data: registration });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to cancel registration", error: error.message });
  }
};
