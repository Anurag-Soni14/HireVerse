import CandidateProfile from "../models/CandidateProfile.js";

export const searchCandidates = async (req, res) => {
  try {
    const { q, location, skills, page = 1, limit = 10 } = req.query;

    const filter = {};

    // 🔍 Search by name, skills, or title
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { title: { $regex: q, $options: "i" } },
        { skills: { $regex: q, $options: "i" } },
      ];
    }

    // Filter by location or skills
    if (location) filter.location = { $regex: location, $options: "i" };
    if (skills) filter.skills = { $in: skills.split(",") };

    // 📄 Pagination
    const skip = (page - 1) * limit;

    const [candidates, totalCandidates] = await Promise.all([
      CandidateProfile.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select("name email title location experience skills resumeUrl"),
      CandidateProfile.countDocuments(filter),
    ]);

    return res.json({
      candidates,
      pagination: {
        totalCandidates,
        totalPages: Math.ceil(totalCandidates / limit),
        currentPage: Number(page),
      },
    });
  } catch (err) {
    console.error("Error fetching candidates:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCandidate = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ user: req.params.id });
    if (!profile) return res.status(404).json({ message: "Not found" });
    return res.json(profile);
  } catch {
    return res.status(404).json({ message: "Not found" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ user: req.user.id })
      .populate("user", "name email")
      .select("-passwordHash");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCandidateProfile = async (req, res) => {
  try {
    const { name, email, phone, location, title, bio, experience, skills } =
      req.body;

    // Find existing profile
    const candidateProfile = await CandidateProfile.findOne({
      user: req.user.id,
    });
    if (!candidateProfile)
      return res.status(404).json({ message: "Profile not found" });

    // Prepare update data
    const updateData = {
      name,
      email,
      phone,
      location,
      title,
      bio,
      experience,
      skills: Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim()),
    };

    // Include resume info if file uploaded
    if (req.file) {
      // File is stored on disk under /uploads by multer config
      updateData.resumeUrl = `uploads/${req.file.filename}`;
      updateData.resumeOriginalName = req.file.originalname;
    }

    // Update profile in database
    const updatedProfile = await CandidateProfile.findOneAndUpdate(
      { user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
