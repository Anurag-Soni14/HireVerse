import Job from "../models/Job.js";
import Application from "../models/Application.js";
import CandidateProfile from "../models/CandidateProfile.js";

export const listJobs = async (req, res) => {
  try {
    // Resolve candidate identifiers used in applications
    const candidateProfile = await CandidateProfile.findOne({
      user: req.user.id,
    }).select("_id");
    const candidateIds = [candidateProfile?._id, req.user.id].filter(Boolean);
    const { q, type, location, skills, page = 1, limit = 10 } = req.query;

    const filter = {};

    // 🔍 Search
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { company: { $regex: q, $options: "i" } },
        { skills: { $regex: q, $options: "i" } },
      ];
    }

    // Filter by job type, location, or skills
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (skills) filter.skills = { $in: skills.split(",") };

    // Exclude jobs already applied by this candidate (covers both profile._id and user.id)
    if (candidateIds.length > 0) {
      const appliedJobs = await Application.find({
        candidate: { $in: candidateIds },
      }).select("job");
      const appliedJobIds = appliedJobs.map((a) => a.job.toString());
      if (appliedJobIds.length > 0) filter._id = { $nin: appliedJobIds };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const [jobs, totalJobs] = await Promise.all([
      Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Job.countDocuments(filter),
    ]);

    return res.json({
      jobs,
      pagination: {
        totalJobs,
        totalPages: Math.ceil(totalJobs / limit),
        currentPage: Number(page),
      },
    });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const listMyJobs = async (req, res) => {
  try {
    const recruiterId = req.user?.id;
    const { page = 1, limit = 10 } = req.query;

    const filter = { recruiter: recruiterId };

    const skip = (page - 1) * limit;

    // Get jobs
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Count applicants for each job
    const jobsWithApplicants = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({
          job: job._id,
        });
        return { ...job, applicantCount };
      })
    );

    const totalJobs = await Job.countDocuments(filter);

    return res.json({
      jobs: jobsWithApplicants,
      pagination: {
        totalJobs,
        totalPages: Math.ceil(totalJobs / limit),
        currentPage: Number(page),
      },
    });
  } catch (error) {
    console.error("Error fetching recruiter jobs:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Not found" });
    let status = "";
    try {
      const candidateProfile = await CandidateProfile.findOne({
        user: req.user.id,
      }).select("_id");

      const candidateId = candidateProfile?._id;
      console.log(candidateId);
      const application = await Application.findOne({
        job: req.params.id,
        candidate: candidateId,
      }).select("status");
      if (application) status = application.status || "";
      console.log(status);
    } catch (e) {
      console.log(e);
    }
    console.log(status);
    return res.json({ job, status });
  } catch {
    return res.status(404).json({ message: "Not found" });
  }
};

export const createJob = async (req, res) => {
  try {
    const body = req.body;
    const job = await Job.create({
      title: body.title,
      company: body.company,
      location: body.location,
      type: body.type,
      experience: body.experience,
      salary: body.salary,
      skills: body.skills || [],
      shortDescription: body.shortDescription,
      longDescription: body.longDescription,
      postedDate: body.postedDate || new Date(),
      recruiter: req.user.id,
    });
    return res.status(201).json(job);
  } catch (err) {
    return res.status(400).json({ message: "Invalid data" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.user.id },
      {
        ...req.body,
        // ensure only valid fields are persisted
        shortDescription: req.body.shortDescription,
        longDescription: req.body.longDescription,
      },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Not found" });
    return res.json(job);
  } catch {
    return res.status(400).json({ message: "Invalid data" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      recruiter: req.user.id,
    });
    if (!job) return res.status(404).json({ message: "Not found" });
    return res.json({ message: "Deleted" });
  } catch {
    return res.status(400).json({ message: "Invalid data" });
  }
};

export const listApplicants=async(req, res)=> {
  try {
    const jobId = req.params.id;
    const apps = await Application.find({ job: jobId }).sort({ createdAt: -1 });
    return res.json(apps);
  } catch {
    return res.status(400).json({ message: "Invalid data" });
  }
}
