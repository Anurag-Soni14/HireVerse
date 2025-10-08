import Message from "../models/Message.js";
import RecruiterProfile from "../models/RecruiterProfile.js";
import CandidateProfile from "../models/CandidateProfile.js";

export const sendMessage = async (req, res) => {
  try {
    const { toEmail, subject, message } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get sender info from authenticated user
    const userProfile = await RecruiterProfile.findOne({
      user: req.user.id,
    }).populate("user");

    if (!userProfile) {
      return res.status(404).json({ message: "Recruiter profile not found" });
    }

    const fromName = userProfile.user.name; // populated user
    const fromEmail = userProfile.user.email;

    const newMessage = new Message({
      fromName,
      fromEmail,
      fromRole: "recruiter", // or get from user role
      toEmail,
      subject,
      message,
    });

    await newMessage.save();

    return res.status(201).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getMessagesForCandidate = async (req, res) => {
  try {
    // Resolve candidate's email via CandidateProfile
    const candidateProfile = await CandidateProfile.findOne({ user: req.user.id }).select('email');
    if (!candidateProfile) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    const candidateEmail = candidateProfile.email;
    
    const messages = await Message.find({ toEmail: candidateEmail })
      .sort({ sentAt: -1 })
      .lean();  
    return res.json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    ).lean();
    return res.json(message);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};