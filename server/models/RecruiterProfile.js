import mongoose from 'mongoose';

const RecruiterProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true, trim: true },
    contactName: { type: String, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    website: { type: String },
    location: { type: String },
    industry: { type: String },
    size: { type: String },
    description: { type: String },
    logoUrl: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('RecruiterProfile', RecruiterProfileSchema);


