import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import './CandidateModal.css';
import api from '../AxiosInstance'
const CandidateModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: null,
  });
  
  const [agreement, setAgreement] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, resume: e.target.files[0] });
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agreement) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="candidate-modal">
        <div className="modal-header">
            <div></div>
          <h2>Add New Candidate</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name*"
                  className="form-input"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address*"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number*"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  name="position"
                  placeholder="Position*"
                  className="form-input"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  name="experience"
                  placeholder="Experience*"
                  className="form-input"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <div className="file-input-wrapper">
                  <input
                    type="text"
                    readOnly
                    placeholder="Resume*"
                    className="form-input"
                    value={fileName}
                    />
                  <label className="file-upload-button">
                    <Upload size={18} />
                    <input
                      type="file"
                      name="resume"
                      onChange={handleFileChange}
                      className="hidden-file-input"
                      accept=".pdf,.doc,.docx"
                    />
                 
                  </label>
                </div>
              </div>
            </div>
            
            <div className="agreement-row">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={agreement}
                  onChange={() => setAgreement(!agreement)}
                />
                <span className="checkmark"></span>
                <span className="agreement-text">
                  I hereby declare that the above information is true to the best of my knowledge and belief
                </span>
              </label>
            </div>
          </div>
          
          <div className="modal-footer">
            <button
              type="submit"
              className={`save-button ${!agreement ? 'disabled' : ''}`}
              disabled={!agreement}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateModal;