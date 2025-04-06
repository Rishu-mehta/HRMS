import React from 'react';
import './LogoutModal.css'; // style the modal

const LogoutModal = ({ show, onCancel, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Log Out</h2>
        <p>Are you sure you want to log out?</p>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="logout-btn" onClick={onConfirm}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
