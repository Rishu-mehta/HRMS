import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, MoreVertical } from 'lucide-react';
import api from '../../AxiosInstance';
import Loading from '../../components/Loading/Loading';
import './Attendance.css';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredAttendanceData, setFilteredAttendanceData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [statusDropdown, setStatusDropdown] = useState(null);

  const dropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const toggleStatusDropdown = (id, e) => {
    e.stopPropagation();
    setStatusDropdown(statusDropdown === id ? null : id);
  };

  const getAttendanceData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/employee/attendance/');
      if (response.data && response.data.data) {
        setAttendanceData(response.data.data);
        setFilteredAttendanceData(response.data.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setAttendanceData([]);
        setFilteredAttendanceData([]);
      }
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
      setAttendanceData([]);
      setFilteredAttendanceData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAttendanceData();

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(null);
      }

      if (
        statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)
      ) {
        setStatusDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let result = [...attendanceData];

    if (statusFilter) {
      result = result.filter(item => {
        const status = item.attendance?.status?.toLowerCase() || 'no attendance recorded';
        return status === statusFilter.toLowerCase();
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.employee?.fullName?.toLowerCase().includes(query) ||
        item.employee?.position?.toLowerCase().includes(query) ||
        item.employee?.email?.toLowerCase().includes(query)
      );
    }

    setFilteredAttendanceData(result);
  }, [attendanceData, statusFilter, searchQuery]);

  const handleStatusChange = async (employeeId, newStatus) => {
    try {
      setIsLoading(true);
      const response = await api.patch(`/api/employee/attendance/${employeeId}`, { status: newStatus });

      if (response.data && response.data.success) {
        await getAttendanceData();
      } else {
        console.error('Failed to update status:', response.data);
        alert('Failed to update. Try again.');
      }
      setStatusDropdown(null);
    } catch (error) {
      console.error('Failed to update attendance status:', error);
      alert('Failed to update. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (!status) return '';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('present')) return 'present';
    if (statusLower.includes('absent')) return 'absent';
    if (statusLower.includes('medical')) return 'medical-leave';
    if (statusLower.includes('home')) return 'work-from-home';
    if (statusLower.includes('no attendance')) return 'no-attendance';
    return '';
  };

  const statusOptions = ['Present', 'Absent', 'Medical Leave', 'Work from Home', 'No Attendance Recorded'];

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
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="medical leave">Medical Leave</option>
              <option value="work from home">Work from Home</option>
              <option value="no attendance recorded">No Attendance</option>
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
        {filteredAttendanceData.length > 0 ? (
          <table className="candidate-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Employee Name</th>
                <th>Position</th>
                <th>Email</th>
                <th>Task</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendanceData.map((item, index) => (
                <tr key={item.employee?._id || index}>
                  <td>
                    <img src={item.employee?.profile || '/default-avatar.png'} alt="profile" className="profile-image" />
                  </td>
                  <td>{item.employee?.fullName || 'N/A'}</td>
                  <td>{item.employee?.position || 'N/A'}</td>
                  <td>{item.employee?.email || 'N/A'}</td>
                  <td>{item.attendance?.task || 'No task assigned'}</td>
                  <td>
                    <div className="status-wrapper">
                      <div 
                        className="status-container" 
                        onClick={(e) => toggleStatusDropdown(item.employee?._id, e)}
                      >
                        <span className={`status-badge ${getStatusClass(item.attendance?.status)}`}>
                          {item.attendance?.status
                            ? item.attendance.status.charAt(0).toUpperCase() +
                              item.attendance.status.slice(1).toLowerCase()
                            : 'New'}
                        </span>
                        <ChevronDown 
                          size={16} 
                          className={`status-dropdown-icon ${statusDropdown === item.employee?._id ? 'rotate' : ''}`} 
                        />
                      </div>

                      {statusDropdown === item.employee?._id && (
                        <div className="status-dropdown" ref={statusDropdownRef}>
                          {statusOptions.map((status) => (
                            <div
                              key={status}
                              className="status-option"
                              onClick={() => handleStatusChange(item.employee._id, status)}
                            >
                              {status}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-menu">
                      <button className="action-button" onClick={(e) => toggleDropdown(`action-${item.employee?._id}`, e)}>
                        <MoreVertical size={18} />
                      </button>
                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-candidates">
            <p>No attendance records found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
