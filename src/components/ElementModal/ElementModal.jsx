import React from 'react';
import './ElementModal.css';

const ElementModal = ({ element, onClose, showModels: showModelsProp }) => {
  const showModels = !!showModelsProp;
  if (!element) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="big-atomic-number">Atomic Number: {element.number}</div>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{element.name} ({element.symbol})</h2>
        {!showModels ? (
          <>
            <div className="element-image">
              {element.image && element.image.url && (
                <img
                  src={element.image.url}
                  alt={element.name}
                  title={element.image.title}
                />
              )}
            </div>
            <div className="element-details">
              <p><strong>Atomic Mass:</strong> {element.atomic_mass}</p>
              <p><strong>Category:</strong> {element.category}</p>
              <p><strong>Discovered by:</strong> {element.discovered_by || 'Unknown'}</p>
              <p><strong>Phase at STP:</strong> {element.phase}</p>
              <p><strong>Melting Point:</strong> {element.melt} K</p>
              <p><strong>Boiling Point:</strong> {element.boil} K</p>
              <p><strong>Density:</strong> {element.density} g/cm³</p>
              <p><strong>Electron Configuration:</strong> {element.electron_configuration}</p>
              <p><strong>Electronegativity:</strong> {element.electronegativity_pauling || 'Unknown'}</p>
            </div>
            <div className="element-summary">
              <h3>Summary</h3>
              <p>{element.summary}</p>
            </div>
            {element.source && (
              <div className="element-source">
                <a href={element.source} target="_blank" rel="noopener noreferrer">
                  Learn more on Wikipedia
                </a>
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <h3>Bohr Model</h3>
              {element.bohr_model_image ? (
                <img src={element.bohr_model_image} alt="" style={{ maxWidth: 300 }} />
              ) : <div>No Bohr model image available.</div>}
            </div>
            <div className="model-3d-section">
              <h3>3D Model</h3>
              {element.bohr_model_3d ? (
                <model-viewer
                  src={element.bohr_model_3d}
                  alt=""
                  camera-controls
                  style={{ width: 300, height: 300 }}
                  ar
                  auto-rotate
                />
              ) : <div>No 3D model available.</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ElementModal;