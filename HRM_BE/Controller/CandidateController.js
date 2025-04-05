const Candidate = require('../Models/CandidateModel');

// POST /add-candidate
const addCandidate = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, position, experience } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    const resumeUrl = req.file.path;

    const newCandidate = await Candidate.create({
      fullName,
      email,
      phoneNumber,
      position,
      experience,
      resume: resumeUrl
    });

    res.status(201).json({
      message: 'Candidate added successfully',
      candidate: newCandidate
    });
  } catch (error) {
    console.log("--------------",error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE /delete-candidate/:id
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /update-status/:id
const updateStatusCandidate = async (req, res) => {
  try {
    const { status } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json({ message: 'Status updated', candidate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /get-all-candidates
const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addCandidate,
  deleteCandidate,
  updateStatusCandidate,
  getAllCandidates
};
