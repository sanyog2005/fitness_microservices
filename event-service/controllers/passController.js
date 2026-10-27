import Pass from "../models/passModel.js";
import UserPass from "../models/userPassModel.js";

// @desc Create Pass (Admin)
export const createPass = async (req, res) => {
  try {
    const pass = new Pass(req.body);
    const saved = await pass.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Update Pass (Admin)
export const updatePass = async (req, res) => {
  try {
    const pass = await Pass.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pass) return res.status(404).json({ success: false, message: "Pass not found" });
    res.json({ success: true, data: pass });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Delete Pass (Admin)
export const deletePass = async (req, res) => {
  try {
    const pass = await Pass.findByIdAndDelete(req.params.id);
    if (!pass) return res.status(404).json({ success: false, message: "Pass not found" });
    res.json({ success: true, message: "Pass deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all passes (Public)
export const getAllPasses = async (req, res) => {
  try {
    const passes = await Pass.find({ isActive: true });
    res.json({ success: true, data: passes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all user passes (Admin)
export const getAllUserPasses = async (req, res) => {
  try {
    const userPasses = await UserPass.find({}).populate("passId").sort({ createdAt: -1 });
    res.json({ success: true, count: userPasses.length, data: userPasses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get logged-in user active pass
export const getMyPass = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const email = req.user?.email || req.query.email;

    const query = userId ? { userId } : { customerEmail: email };
    const userPass = await UserPass.findOne({ ...query, status: "active" }).populate("passId");

    res.json({ success: true, data: userPass || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Purchase / Activate Pass
export const purchasePass = async (req, res) => {
  try {
    const { passId, customerEmail, runsIncluded, validityWeeks } = req.body;
    const userId = req.user?.userId || "guest";

    let expiresAt = null;
    if (validityWeeks && validityWeeks > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + validityWeeks * 7);
    }

    const userPass = await UserPass.create({
      userId,
      passId,
      customerEmail,
      runsRemaining: runsIncluded || 5,
      expiresAt,
      status: "active",
      paymentStatus: "paid",
    });

    res.status(201).json({ success: true, data: userPass });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Cancel User Pass (Admin)
export const cancelUserPass = async (req, res) => {
  try {
    const userPass = await UserPass.findByIdAndUpdate(req.params.id, { status: "cancelled" }, { new: true });
    if (!userPass) return res.status(404).json({ success: false, message: "User pass not found" });
    res.json({ success: true, data: userPass });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Grant Pass Manually (Admin)
export const grantUserPass = async (req, res) => {
  try {
    const { email, passId, runs } = req.body;
    const pass = await Pass.findById(passId);
    if (!pass) return res.status(404).json({ success: false, message: "Pass not found" });

    const userPass = await UserPass.create({
      userId: "granted-by-admin",
      passId,
      customerEmail: email,
      runsRemaining: runs || pass.runsIncluded,
      status: "active",
      paymentStatus: "paid",
    });

    res.status(201).json({ success: true, data: userPass });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
