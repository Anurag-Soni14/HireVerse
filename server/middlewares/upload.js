import multer from "multer";
import path from "path";

// Store files in /uploads folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Save file as candidateId_timestamp.extension
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}_${Date.now()}${ext}`);
  },
});

// Only accept PDFs or DOCX
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || 
      file.mimetype === "application/msword" || 
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF or DOC/DOCX files are allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit
