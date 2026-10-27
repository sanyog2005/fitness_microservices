import Setting from "../models/settingModel.js";

// @desc Get platform settings
export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.find({});
    const map = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });
    res.json({ success: true, data: map });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update platform setting
export const updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ success: false, message: "Setting key required." });

    const setting = await Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
