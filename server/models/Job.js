import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Remote'], required: true },
    experience: { type: String, required: true },
    salary: { type: String, required: true },
    skills: { type: [String], default: [] },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    postedDate: { type: Date, default: Date.now },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Job', JobSchema);


