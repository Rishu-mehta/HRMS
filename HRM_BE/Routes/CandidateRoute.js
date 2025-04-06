const express = require("express");
const { addCandidate, deleteCandidate, updateStatusCandidate, getAllCandidates } = require("../Controller/CandidateController");
const upload = require("../Utils/cloudinaryMulter");
const router = express.Router();


// Fix the POST route
router.post('/', upload.single('resume'), (req, res, next) => {
  console.log('After upload middleware:', req.body);
  console.log('Uploaded file:', req.file);
  next();
}, addCandidate);

router.get("/", getAllCandidates);
router.patch("/:id", updateStatusCandidate);
router.delete("/:id",deleteCandidate);

module.exports = router;