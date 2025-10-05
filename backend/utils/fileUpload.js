import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = 'uploads/resumes';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename: userId_timestamp_originalname
    const uniqueName = `${req.user._id}_${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

// File filter to only allow PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for resume upload'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to delete old resume file
export const deleteOldResume = (resumePath) => {
  if (resumePath && fs.existsSync(resumePath)) {
    try {
      fs.unlinkSync(resumePath);
      console.log('Old resume deleted:', resumePath);
    } catch (error) {
      console.error('Error deleting old resume:', error);
    }
  }
};

export default upload;