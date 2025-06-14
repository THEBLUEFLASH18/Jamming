import React from 'react';
import './CustomAlert.css';

function CustomAlert({ isOpen, type, title, message, onClose }) {
  if (!isOpen) return null;
  
  // Determine the alert type class
  const alertTypeClass = type ? `alert-${type}` : '';
  
  return (
    <div className="alert-overlay" onClick={onClose}>
      <div 
        className={`alert-container ${alertTypeClass}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {title && <div className="alert-title">{title}</div>}
        <div className="alert-message">{message}</div>
        <button className="alert-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

export default CustomAlert;
