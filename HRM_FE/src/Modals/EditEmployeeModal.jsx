import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import './CandidateModal.css'; // Reusing the same CSS file

const EditEmployeeModal = ({ isOpen, onClose, onSave, employeeData }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    dateofjoining: '',
  });
  

  useEffect(() => {
    if (employeeData) {
      setFormData({
        fullName: employeeData.fullName || '',
        email: employeeData.email || '',
        phone: employeeData.phoneNumber || '',
        position: employeeData.position || '',
        department: employeeData.department || '',
        dateofjoining: employeeData.dateofjoining || '',
      });
      console.log(employeeData.dateofjoining)
    }
  }, [employeeData]);
  
  const formatDateForInput = (isoDateString) => {
    if (!isoDateString) return '';
    
    try {
      const date = new Date(isoDateString);
      if (isNaN(date.getTime())) return '';
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${day}-${month}-${year}`;
    } catch (error) {
      return '';
    }
  };

 

  const [agreement, setAgreement] = useState(false);
  const [positionDropdownOpen, setPositionDropdownOpen] = useState(false);
  
  const positions = ['Intern', 'Full Time', 'Junior', 'Senior', 'Team Lead'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePositionSelect = (position) => {
    setFormData({ ...formData, position });
    setPositionDropdownOpen(false);
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
        <div className="modal-header" style={{ backgroundColor: '#4B0082', color: 'white' }}>
          <div></div>
          <h2>Edit Employee Details</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} color="white" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name*</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-input"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email Address*</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Phone Number*</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Department*</label>
                <input
                  type="text"
                  name="department"
                  className="form-input"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Position*</label>
                <div className="position-dropdown">
                  <div 
                    className="form-input" 
                    onClick={() => setPositionDropdownOpen(!positionDropdownOpen)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    {formData.position}
                    <span>▼</span>
                  </div>
                  
                  {positionDropdownOpen && (
                    <div className="dropdown-menu">
                      {positions.map(position => (
                        <div 
                          key={position} 
                          className="dropdown-item"
                          onClick={() => handlePositionSelect(position)}
                        >
                          {position}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
             
              
              <div className="form-group">
                <label className="form-label">Date of Joining*</label>
                <div className="date-input-wrapper">
                  <input
                    type="date"
                    name="dateofjoining"
                    className="form-input"
                    value={formData.dateofjoining}
                    onChange={handleChange}
                    required
                  />
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

export default EditEmployeeModal;