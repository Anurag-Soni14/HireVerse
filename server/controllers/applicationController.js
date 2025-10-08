import Application from "../models/Application.js";
import Job from "../models/Job.js";
import CandidateProfile from "../models/CandidateProfile.js";

export const listApplications = async (req, res) => {
  try {
    const candidateId = await CandidateProfile.findOne({
      user: req.user.id,
    }).select("_id");
    const apps = await Application.find({ candidate: candidateId })
      .populate("job")
      .sort({ createdAt: -1 });
    return res.json(apps);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const candidateProfile = await CandidateProfile.findOne({
      user: req.user.id,
    });
    const app = await Application.create({
      job: job._id,
      candidate: candidateProfile?._id || req.user.id,
      candidateName: candidateProfile?.name || "Candidate",
      candidateEmail: candidateProfile?.email,
      experience: candidateProfile?.experience,
      location: candidateProfile?.location,
      skills: candidateProfile?.skills || [],
      resumeUrl: candidateProfile?.resumeUrl,
      status: "Applied",
      appliedDate: new Date(),
    });
    return res.status(201).json(app);
  } catch {
    return res.status(400).json({ message: "Invalid data" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.json(updated);
  } catch {
    return res.status(400).json({ message: "Invalid data" });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!jobId)
      return res.status(400).json({ message: "Please provide job ID" });
    const applicants = await Application.find({ job: jobId }).populate("job");

    if (!applicants || applicants.length === 0)
      return res
        .status(404)
        .json({ message: "No applicants found for this job" });

    return res.status(200).json(applicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const withdraw = async (req, res) => {
  try {
    const userId = await CandidateProfile.findOne({user: req.user.id}).select("_id");
    if(!userId) return res.status(404).json({ message: "Candidate profile not found" });
    const deleted = await Application.findOneAndDelete({
      _id: req.params.id,
      candidate: userId,
    });

    if (!deleted) return res.status(404).json({ message: "Application not found" });
    return res.json({ message: "Withdrawn successfully", success: true });
  } catch (error) {
    console.error("Withdraw error:", error);
    return res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

