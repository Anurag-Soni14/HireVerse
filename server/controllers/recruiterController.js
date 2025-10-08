import RecruiterProfile from "../models/RecruiterProfile.js";

export const getRecruiterProfile = async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOne({ user: req.user.id })
      .populate("user", "name email")
      .lean();

    if (!profile) return res.status(404).json({ message: "Not found" });
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateRecruiter = async (req, res) => {
  try {
    if (req.user.role !== "recruiter" || req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await RecruiterProfile.findOneAndUpdate(
      { user: req.params.id },
      req.body,
      { new: true, runValidators: true }
    ).populate("user", "name email");

    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ message: "Invalid data" });
  }
};
