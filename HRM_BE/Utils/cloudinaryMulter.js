const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'resumes',
    resource_type: 'raw', // for PDF/doc/docx
    allowed_formats: ['pdf', 'doc', 'docx']
  }
});

const upload = multer({ storage });

module.exports = upload;
