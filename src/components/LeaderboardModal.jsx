import React from 'react';


const LeaderboardModal = ({ children, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button className="close-button" onClick={onClose}>
          close
        </button>
      </div>
    </div>
  );
};

export default LeaderboardModal;