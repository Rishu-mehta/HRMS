import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Users, User, ClipboardList, Calendar, LogOut } from 'lucide-react';
import './Sidebar.css';
import LogoutModal from '../../Modals/LogoutModal';


const Sidebar = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  
  const handleLogout =async () => {
    localStorage.clear();
     setTimeout(() => {
      window.location.reload();
    }
    , 1000);
  };
  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="logo-container">
        <div className="logo">LOGO</div>
      </div>

      {/* Search Box */}
      <div className="sidebar-search">
        <Search className="sidebar-search-icon" size={16} />
        <input type="text" placeholder="Search" />
      </div>

      {/* Sidebar Menu Categories */}
      <div className="sidebar-menu">
        {/* Recruitment Category */}
        <div className="menu-category">
          <h3>Recruitment</h3>
          <ul>
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                <Users size={18} className="menu-icon" />
                <span>Candidates</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Organization Category */}
        <div className="menu-category">
          <h3>Organization</h3>
          <ul>
            <li>
              <NavLink to="/employees" className={({ isActive }) => isActive ? 'active' : ''}>
                <User size={18} className="menu-icon" />
                <span>Employees</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/attendance" className={({ isActive }) => isActive ? 'active' : ''}>
                <ClipboardList size={18} className="menu-icon" />
                <span>Attendance</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/leaves" className={({ isActive }) => isActive ? 'active' : ''}>
                <Calendar size={18} className="menu-icon" />
                <span>Leaves</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Others Category */}
        <div className="menu-category">
          <h3>Others</h3>
          <ul>
            <li>
              <div
                
                className="logout-navlink"
                onClick={() => setShowLogoutModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <LogOut size={18} className="menu-icon" />
                <span>Logout</span>
              </div>
            </li>

          </ul>
        </div>
      </div>
      <LogoutModal
        show={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>

  );
};

export default Sidebar;