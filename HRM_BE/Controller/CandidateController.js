const Candidate = require('../Models/CandidateModel');

// POST /add-candidate
const addCandidate = async (req, res) => {
    try {
      console.log("Request body in controller:", req.body);
      
      const fullName = req.body.fullName;
      const email = req.body.email; 
      const phoneNumber = req.body.phoneNumber;
      const position = req.body.position;
      const experience = req.body.experience;
  
      console.log("Extracted fields:", { fullName, email, phoneNumber, position, experience });
      
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
      const candidates = await Candidate.find({
        status: { $not: { $in: [/^selected$/i, /^rejected$/i] } }
      }).sort({ createdAt: -1 });
  
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
