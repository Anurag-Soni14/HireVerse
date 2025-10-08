import Job from '../models/Job.js';
import Application from '../models/Application.js';
import CandidateProfile from '../models/CandidateProfile.js';

export const getCandidateDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Resolve candidate id used in applications (profile._id)
    const candidateProfile = await CandidateProfile.findOne({ user: userId }).select('_id');
    const candidateId = candidateProfile?._id || userId;

    // Applications for this candidate
    const applications = await Application.find({ candidate: candidateId })
      .populate('job')
      .sort({ createdAt: -1 })
      .lean();

    const appliedJobs = applications.length;
    const shortlisted = applications.filter(a => a.status === 'Shortlisted').length;

    // Available jobs: jobs not applied by this candidate
    const appliedJobIds = applications.map(a => String(a.job?._id || a.job));
    const availableJobs = await Job.countDocuments({ _id: { $nin: appliedJobIds } });

    const recentApplications = applications.slice(0, 3).map(a => ({
      id: String(a._id),
      status: a.status,
      appliedDate: a.appliedDate,
      job: a.job ? {
        _id: String(a.job._id),
        title: a.job.title,
        company: a.job.company,
        location: a.job.location,
        type: a.job.type,
      } : null,
    }));

    return res.json({
      stats: {
        appliedJobs,
        shortlisted,
        availableJobs,
      },
      recentApplications,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/dashboard/recruiter - recruiter stats + recent jobs
export const getRecruiterDashboard = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const jobs = await Job.find({ recruiter: recruiterId })
      .sort({ createdAt: -1 })
      .lean();

    const jobIds = jobs.map(j => j._id);

    // Total applicants across all jobs
    const applicantsByJob = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$job', count: { $sum: 1 }, shortlisted: { $sum: { $cond: [{ $eq: ['$status', 'Shortlisted'] }, 1, 0] } } } },
    ]);

    const jobIdToCounts = new Map(applicantsByJob.map(row => [String(row._id), { count: row.count, shortlisted: row.shortlisted }]));

    const totalApplicants = applicantsByJob.reduce((sum, row) => sum + row.count, 0);
    const shortlisted = applicantsByJob.reduce((sum, row) => sum + row.shortlisted, 0);

    const activeJobs = jobs.length; // assuming all are active for now

    const recentJobs = jobs.slice(0, 3).map(j => ({
      _id: String(j._id),
      title: j.title,
      location: j.location,
      type: j.type,
      applicantCount: jobIdToCounts.get(String(j._id))?.count || 0,
    }));

    return res.json({
      stats: {
        activeJobs,
        totalApplicants,
        shortlisted,
      },
      recentJobs,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};


