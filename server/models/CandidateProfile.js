import mongoose from 'mongoose';

const CandidateProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    location: { type: String },
    title: { type: String },
    bio: { type: String },
    experience: { type: String },
    skills: { type: [String], default: [] },
    resumeUrl: { type: String },
    resumeOriginalName: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('CandidateProfile', CandidateProfileSchema);


