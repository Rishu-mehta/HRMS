import React from 'react';
import { Mail, Bell, ChevronDown, Search } from 'lucide-react';
import './Header.css';
import { useLocation } from 'react-router-dom';

const getPageTitle = () => {
  const location = useLocation();
  switch (location.pathname) {
    case '/':
      return 'Dashboard';
    case '/candidates':
      return 'Candidate Management';
    case '/employees':
      return 'Employee Management';
    case '/attendance':
      return 'Attendance Management';
    case '/leaves':
      return 'Leaves Management';
    default:
      return 'HRMS Dashboard';
  }
};

const Header = () => {
  return (
    <div className="header">
      <div className="header-content">
        <div className="header-title">
          <h1>{getPageTitle()}</h1>
        </div>
        <div className="header-actions">
          {/* Header Action Icons */}
          <div className="action-icons">
            <button className="icon-button">
              <Mail size={20} />
            </button>
            <button className="icon-button">
              <Bell size={20} />
            </button>
          </div>
          
          {/* User Profile */}
          <div className="user-profile">
            <div className="avatar">
              <img src="/avatar-placeholder.png" alt="User" />
            </div>
            <ChevronDown size={14} className="dropdown-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;