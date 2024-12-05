import React, { useState, useEffect } from 'react';

function Paintwork({ isOpen, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 1000); // Match this with animation duration
  };

  if (!isOpen) return null;
  
  return (
    <div className={`modal__overlay ${isClosing ? 'modal--closing' : ''}`} onClick={handleClose}>
      <div className="modal__content" onClick={e => e.stopPropagation()}>
        <button 
          className="modal__close"
          onClick={handleClose}
        >
          ×
        </button>
        <div className="modal__body">
          Paintwork Content Here
        </div>
      </div>
    </div>
  );
}

export default Paintwork;