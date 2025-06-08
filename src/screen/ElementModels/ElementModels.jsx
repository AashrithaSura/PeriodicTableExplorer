import React from 'react';
import ReactDOM from 'react-dom';

const ElementModal = ({ element, onClose, handleShowModels }) => {
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{element.name} ({element.symbol})</h2>
        <p>Atomic Number: {element.number}</p>
        {/* Add other element details here */}
        <button onClick={() => handleShowModels(element)}>View 3D Models</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
};

export default ElementModal;