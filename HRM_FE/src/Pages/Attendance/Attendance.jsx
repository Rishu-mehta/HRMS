import React, { useState } from 'react';
import { Search, ChevronDown, MoreVertical } from 'lucide-react';

const Attendance = () => {
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Sample candidate data
  const candidates = [
    {
      id: '01',
      name: 'Jacob William',
      email: 'jacob.william@example.com',
      phone: '(252) 555-0111',
      position: 'Senior Developer',
      status: 'New',
      experience: '1+'
    },
    {
      id: '02',
      name: 'Guy Hawkins',
      email: 'kenzi.lawson@example.com',
      phone: '(907) 555-0101',
      position: 'Human Resource Manager',
      status: 'New',
      experience: '3+'
    },
    {
      id: '03',
      name: 'Arlene McCoy',
      email: 'arlene.mccoy@example.com',
      phone: '(302) 555-0107',
      position: 'Full Time Designer',
      status: 'Selected',
      experience: '2+'
    },
    {
      id: '04',
      name: 'Leslie Alexander',
      email: 'willie.jennings@example.com',
      phone: '(207) 555-0119',
      position: 'Full Time Developer',
      status: 'Rejected',
      experience: '0'
    }
    
  ];

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(null);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="candidate-page">
      
      <div className="filters-container">
        <div className="filter-group">
          <div className="filter-dropdown">
            <select className="filter-select">
              <option value="">Status</option>
              <option value="new">New</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>
          
          <div className="filter-dropdown">
            <select className="filter-select">
              <option value="">Position</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="hr">Human Resources</option>
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>
        </div>
        
        <div className="search-add-group">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search" className="search-input" />
          </div>
          
          <button className="add-candidate-btn">Add Candidate</button>
        </div>
      </div>
      
      <div className="table-container">
        <table className="candidate-table">
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Candidates Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Status</th>
              <th>Experience</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>{candidate.id}</td>
                <td>{candidate.name}</td>
                <td>{candidate.email}</td>
                <td>{candidate.phone}</td>
                <td>{candidate.position}</td>
                <td>
                  <div className="status-container">
                    <span className={`status-badge ${candidate.status.toLowerCase()}`}>
                      {candidate.status}
                    </span>
                    {(candidate.status === 'New' || candidate.status === 'Rejected') && (
                      <ChevronDown size={16} className="status-dropdown-icon" />
                    )}
                  </div>
                </td>
                <td>{candidate.experience}</td>
                <td>
                  <div className="action-menu">
                    <button className="action-button" onClick={(e) => toggleDropdown(candidate.id, e)}>
                      <MoreVertical size={18} />
                    </button>
                    {dropdownOpen === candidate.id && (
                      <div className="action-dropdown">
                        <div className="dropdown-item">Download Resume</div>
                        <div className="dropdown-item">Delete Candidate</div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;