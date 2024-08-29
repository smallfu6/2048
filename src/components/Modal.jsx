import React from 'react';
// import './Modal.scss'; // 添加弹框样式

const Modal = ({ children, onClose }) => {
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

export default Modal;