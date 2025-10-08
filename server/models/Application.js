import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'CandidateProfile', required: true },
    candidateName: { type: String, required: true },
    candidateEmail: { type: String, required: true },
    status: { type: String, enum: ['Applied', 'Shortlisted', 'Interview', 'Rejected'], default: 'Applied' },
    appliedDate: { type: Date, default: Date.now },
    experience: { type: String },
    location: { type: String },
    skills: { type: [String], default: [] },
    resumeUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Application', ApplicationSchema);


