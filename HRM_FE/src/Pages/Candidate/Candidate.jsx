import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, MoreVertical, CloudHail } from 'lucide-react';
import CandidateModal from '../../Modals/CandidateModal';
import './Candidate.css';
import api from '../../AxiosInstance';
import Loading from '../../components/Loading/Loading';

const Candidate = () => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  const dropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  const statusOptions = ['New', 'Scheduled', 'Ongoing', 'Selected', 'Rejected'];

  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const toggleStatusDropdown = (id, e) => {
    e.stopPropagation();
    setStatusDropdown(statusDropdown === id ? null : id);
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      setIsLoading(true);
      await api.patch(`/api/candidate/${candidateId}`, { status: newStatus.toLowerCase() });

      setCandidates(candidates.map(candidate => 
        candidate._id === candidateId ? {...candidate, status: newStatus.toLowerCase()} : candidate
      ));
      setStatusDropdown(null);
    } catch (error) {
      console.error('Failed to update candidate status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCandidates = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/candidate/');
      setCandidates(response.data);
      setFilteredCandidates(response.data);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCandidates();

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(null);
        setStatusDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!candidates || candidates.length === 0) {
      setFilteredCandidates([]);
      return;
    }

    try {
      let result = [...candidates];

      if (statusFilter) {
        result = result.filter(candidate => 
          candidate.status && candidate.status.toLowerCase() === statusFilter.toLowerCase()
        );
      }

      if (positionFilter) {
        result = result.filter(candidate => 
          candidate.position && candidate.position.toLowerCase() === positionFilter.toLowerCase()
        );
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(candidate => 
          (candidate.fullName && candidate.fullName.toLowerCase().includes(query)) ||
          (candidate.email && candidate.email.toLowerCase().includes(query)) ||
          (candidate.phoneNumber && candidate.phoneNumber.includes(query))
        );
      }

      setFilteredCandidates(result);
    } catch (error) {
      console.error('Error filtering candidates:', error);
      setFilteredCandidates(candidates);
    }
  }, [candidates, statusFilter, positionFilter, searchQuery]);

  const handleAddCandidate = async (candidateData) => {
    const formData = new FormData();
    formData.append('fullName', candidateData.fullName);
    formData.append('email', candidateData.email);
    formData.append('phoneNumber', candidateData.phone); 
    formData.append('position', candidateData.position);
    formData.append('experience', candidateData.experience);
    
    if (candidateData.resume) {
      formData.append('resume', candidateData.resume);
    }

    try {
      setIsLoading(true);
      const response = await api.post('/api/candidate/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response && response.data) {
        setModalOpen(false);
        setCandidates(prev => [...prev, response.data]);
        getCandidates();
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error('Failed to add candidate:', error);
      alert('There was an error adding the candidate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    try {
      setIsLoading(true);
      await api.delete(`/api/candidate/${candidateId}`);
      setCandidates(prev => prev.filter(candidate => candidate._id !== candidateId));
      setDropdownOpen(null);
    } catch (error) {
      console.error('Failed to delete candidate:', error);
      alert('There was an error deleting the candidate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResume = (resumeUrl, candidateName) => {
    if (!resumeUrl) {
      alert('Resume not available');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const link = document.createElement('a');
      link.href = resumeUrl;
  
     console.log(resumeUrl)
      link.target = '_blank';
  
      link.setAttribute('download', `${candidateName}_resume.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download resume:', error);
      alert('Unable to download resume.');
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };
  

  return (
    <div className="candidate-page">
      {isLoading && <Loading />}

      <div className="filters-container">
        <div className="filter-group">
          <div className="filter-dropdown">
            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Status</option>
              <option value="new">New</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="pending">Pending</option>
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>

          <div className="filter-dropdown">
            <select 
              className="filter-select"
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
            >
              <option value="">Position</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="hr">Human Resources</option>
              <option value="intern">Intern</option>
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>
        </div>

        <div className="search-add-group">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search" 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="add-candidate-btn" onClick={() => setModalOpen(true)}>
            Add Candidate
          </button>
        </div>
      </div>

      <div className="table-container">
        {filteredCandidates.length > 0 ? (
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
              {filteredCandidates.map((candidate, index) => (
                <tr key={candidate._id || index}>
                  <td>{index + 1}</td>
                  <td>{candidate.fullName || 'N/A'}</td>
                  <td>{candidate.email || 'N/A'}</td>
                  <td>{candidate.phoneNumber || 'N/A'}</td>
                  <td>{candidate.position || 'N/A'}</td>
                  <td>
                    <div className="status-wrapper">
                      <div 
                        className="status-container" 
                        onClick={(e) => toggleStatusDropdown(candidate._id, e)}
                      >
                        <span className={`status-badge ${(candidate.status || 'new').toLowerCase()}`}>
                          {candidate.status ? candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1).toLowerCase() : 'New'}
                        </span>
                        <ChevronDown 
                          size={16} 
                          className={`status-dropdown-icon ${statusDropdown === candidate._id ? 'rotate' : ''}`} 
                        />
                      </div>

                      {statusDropdown === candidate._id && (
                        <div className="status-dropdown" ref={statusDropdownRef}>
                          {statusOptions.map((status) => (
                            <div
                              key={status}
                              className="status-option"
                              onClick={() => handleStatusChange(candidate._id, status)}
                            >
                              {status}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{candidate.experience || 'N/A'}</td>
                  <td>
                    <div className="action-menu">
                      <button className="action-button" onClick={(e) => toggleDropdown(candidate._id, e)}>
                        <MoreVertical size={18} />
                      </button>
                      {dropdownOpen === candidate._id && (
                        <div className="action-dropdown" ref={dropdownRef}>
                          <div className="dropdown-item">
                            <button className="edit-btn"onClick={() => {
                              downloadResume(candidate.resume, candidate.fullName);
                              setDropdownOpen(null);
                            }}>
                              Download Resume
                            </button>
                          </div>
                          <div className="dropdown-item">
                            <button className='edit-btn' onClick={() => {
                              handleDeleteCandidate(candidate._id);
                              setDropdownOpen(null);
                            }}>
                              Delete Candidate
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-candidates">
            <p>No candidates found. Add a new candidate to get started.</p>
          </div>
        )}
      </div>

      <CandidateModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={handleAddCandidate}
      />
    </div>
  );
};

export default Candidate;
