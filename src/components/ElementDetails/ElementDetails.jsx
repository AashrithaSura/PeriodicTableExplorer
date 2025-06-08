import React from 'react';
import { useParams, Link } from 'react-router-dom';
import elementsData from '../../data/elements1.json';
import SearchBar from '../SearchBar/SearchBar';
import './ElementDetails.css';

function ElementDetails() {
  const { identifier } = useParams();
  
  const element = elementsData.Elements.find(el => {
    // Try numeric ID first
    if (!isNaN(identifier) && el.ElementID === parseInt(identifier, 10)) {
      return true;
    }
    // Then try case-insensitive symbol or name match
    const lowerId = identifier.toLowerCase();
    return (
      el.Symbol.toLowerCase() === lowerId || 
      el.Name.toLowerCase() === lowerId
    );
  });

  if (!element) {
    return (
      <div className="element-details-container">
        <div className="element-not-found">
          Element not found
        </div>
        <Link to="/" className="element-details-return-link">
          Return to Periodic Table
        </Link>
      </div>
    );
  }

  return (
    <div className="element-details-container">
      <header className="element-details-header">
        <div className="element-details-identity">
          <span className="element-details-atomic-number">{element.ElementID}</span>
          <h1>{element.Name} <span className="element-details-symbol">({element.Symbol})</span></h1>
        </div>
        <Link to="/" className="element-details-back-button">← Back to Table</Link>
      </header>

      <div className="element-details-sections">
        <section className="element-details-basic-properties">
          <h2>💡 Basic Properties</h2>
          <div className="element-details-property-grid">
            <div className="element-details-property">
              <span className="element-details-label">Discovery Year</span>
              <span className="element-details-value">{element.DiscoveryYear}</span>
            </div>
            <div className="element-details-property">
              <span className="element-details-label">Discovered By</span>
              <span className="element-details-value">{element.DiscoveredBy}</span>
            </div>
            <div className="element-details-property">
              <span className="element-details-label">Name Origin</span>
              <span className="element-details-value">{element.OriginOfName}</span>
            </div>
            <div className="element-details-property">
              <span className="element-details-label">Crustal Abundance</span>
              <span className="element-details-value">{element.CrustalAbundance} ppm</span>
            </div>
          </div>
        </section>

        <section className="element-details-description">
          <h2>🌌 Description</h2>
          <p>{element.Nature}</p>
        </section>

        <section className="element-details-occurrence">
          <h2>🪐 Natural Occurrence</h2>
          <p>{element.NaturalAbundance}</p>
        </section>

        <section className="element-details-biological">
          <h2>🧬 Biological Significance</h2>
          <p>{element.BiologicalRoles}</p>
        </section>

        <section className="element-details-applications">
          <h2>⚙️ Applications</h2>
          <p>{element.UsesText}</p>
        </section>

        <section className="element-details-history">
          <h2>📜 Historical Context</h2>
          <p>{element.History}</p>
        </section>
      </div>
    </div>
  );
}

export default ElementDetails;