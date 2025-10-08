import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    fromName: { type: String, required: true },
    fromEmail: { type: String, required: true },
    fromRole: { type: String, enum: ['recruiter', 'candidate'], required: true },
    toEmail: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    jobTitle: { type: String },
    read: { type: Boolean, default: false },
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Message', MessageSchema);
