const express = require("express");
const { addCandidate, deleteCandidate, updateStatusCandidate, getAllCandidates } = require("../Controller/CandidateController");
const upload = require("../Utils/cloudinaryMulter");
const router = express.Router();

// In your CandidateRoute.js, modify your post route
router.post('/', (req, res, next) => {
    console.log('Request received at /api/candidate');
    console.log('Request body:', req.body);
    upload.single('resume')(req, res, (err) => {
      if (err) {
        console.log('Multer error:', err);
        return res.status(400).json({ error: err.message });
      }
      console.log('File uploaded successfully:', req.file);
      next();
    });
  }, addCandidate);
router.get("/",getAllCandidates);
router.put("/:id",updateStatusCandidate);
router.delete("/:id", deleteCandidate);

module.exports = router;