const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const originalName = file.originalname.split('.')[0];
    const extension = file.originalname.split('.').pop();
    const sanitizedName = originalName.trim().replace(/\s+/g, '_');

    return {
      folder: 'resumes',
      resource_type: 'raw', 
      public_id: sanitizedName,
      format: extension,
       access_mode: "public"
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Optional: 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF/DOC/DOCX allowed.'));
    }
  }
});

module.exports = upload;
