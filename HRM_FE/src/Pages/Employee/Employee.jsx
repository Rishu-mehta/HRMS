import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, MoreVertical } from 'lucide-react';
import EditEmployeeModal from '../../Modals/EditEmployeeModal';

import api from '../../AxiosInstance';
import Loading from '../../components/Loading/Loading';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [positionFilter, setPositionFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const dropdownRef = useRef(null);

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const getEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/employee/');
      setEmployees(response.data.employees);
      setFilteredEmployees(response.data.employees);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEmployees();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let result = [...employees];

    if (positionFilter) {
      result = result.filter(emp =>
        emp.position?.toLowerCase() === positionFilter.toLowerCase()
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(emp =>
        emp.fullName?.toLowerCase().includes(query) ||
        emp.email?.toLowerCase().includes(query) ||
        emp.phoneNumber?.includes(query)
      );
    }

    setFilteredEmployees(result);
  }, [employees, positionFilter, searchQuery]);

  const handleDelete = async (employeeId) => {
    try {
      setIsLoading(true);
      await api.delete(`/api/employee/${employeeId}`);
      setEmployees(prev => prev.filter(emp => emp._id !== employeeId));
      setDropdownOpen(null);
    } catch (error) {
      console.error('Failed to delete employee:', error);
      alert('Error deleting employee');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
    setDropdownOpen(null);
  };

  const handleSave = async (updatedData) => {
    try {
      setIsLoading(true);
      const response = await api.patch(`/api/employee/${selectedEmployee._id}`, updatedData);
      const updated = response.data;

      setEmployees(prev =>
        prev.map(emp => emp._id === updated._id ? updated : emp)
      );
      setModalOpen(false);
      await getEmployees();
    } catch (error) {
      console.error('Failed to update employee:', error);
      alert('Failed to update. Try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    
    if (isNaN(date.getTime())) return dateString;
    
   
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    

    return `${month}/${day}/${year}`;
  };
  return (
    <div className="candidate-page">
      {isLoading && <Loading />}

      <div className="filters-container">
        <div className="filter-group">
          <div className="filter-dropdown">
            <select 
              className="filter-select"
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
            >
              <option value="">Position</option>
              <option value="intern">Intern</option>
              <option value="full time">Full Time</option>
              <option value="junior">Junior</option>
              <option value="senior">Senior</option>
              <option value="team lead">Team Lead</option>
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
        </div>
      </div>

      <div className="table-container">
        {filteredEmployees.length > 0 ? (
          <table className="candidate-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Employee Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Position</th>
                <th>Department</th>
                <th>Date of Joining</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, index) => (
                <tr key={emp._id || index}>
                  <td>
                    <img src={emp.profile || '/default-avatar.png'} alt="profile" className="profile-image" />
                  </td>
                  <td>{emp.fullName}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phoneNumber}</td>
                  <td>{emp.position}</td>
                  <td>{emp.department}</td>
                  <td>{formatDate(emp.dateofjoining)}</td>
                  <td>
                    <div className="action-menu">
                      <button className="action-button" onClick={(e) => toggleDropdown(emp._id, e)}>
                        <MoreVertical size={18} />
                      </button>
                      {dropdownOpen === emp._id && (
                        <div className="action-dropdown" ref={dropdownRef}>
                          <div className="dropdown-item ">
                            <button className="edit-btn"onClick={() => handleEdit(emp)}>Edit</button>
                          </div>
                          <div className="dropdown-item ">
                            <button className="delete-btn"onClick={() => handleDelete(emp._id)}>Delete</button>
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
            <p>No employees found.</p>
          </div>
        )}
      </div>

      <EditEmployeeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        employeeData={selectedEmployee}
      />
    </div>
  );
};

export default Employee;
