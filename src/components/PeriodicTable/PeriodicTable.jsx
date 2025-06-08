import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Element from '../Element/Element';
import ElementModal from '../ElementModal/ElementModal';
import elementsData from '../../data/elements.json';
import './PeriodicTable.css';

const CATEGORY_LABELS = {
  'alkali-metal': 'Alkali Metal',
  'alkaline-earth-metal': 'Alkaline Earth Metal',
  'transition-metal': 'Transition Metal',
  'post-transition-metal': 'Post-Transition Metal',
  'metalloid': 'Metalloid',
  'diatomic-nonmetal': 'Diatomic Nonmetal',
  'polyatomic-nonmetal': 'Polyatomic Nonmetal',
  'noble-gas': 'Noble Gas',
  'lanthanide': 'Lanthanide',
  'actinide': 'Actinide',
  'unknown': 'Unknown'
};

const PeriodicTable = ({ showModels }) => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [highlightedGroup, setHighlightedGroup] = useState(null);
  const [highlightedPeriod, setHighlightedPeriod] = useState(null);
  const [highlightedCategory, setHighlightedCategory] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [showGapText, setShowGapText] = useState(true);

  const handleElementClick = (element) => {
    if (selectedElement?.number !== element.number) {
      setSelectedElement(element);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedElement(null);
  };

  const handleMouseEnterElement = (element) => {
    setHoveredElement(element);
    setShowGapText(false);
  };

  const handleMouseLeaveElement = () => {
    setHoveredElement(null);
    setShowGapText(true);
  };

  // Safely destructure elementsData
  const { order = [], ...elements } = elementsData || {};

  // Calculate grid dimensions safely
  let maxX = 0;
  let maxY = 0;
  order.forEach(elementName => {
    const element = elements[elementName];
    if (element && element.xpos && element.ypos) {
      maxX = Math.max(maxX, element.xpos);
      maxY = Math.max(maxY, element.ypos);
    }
  });

  // Initialize grid
  const grid = Array.from({ length: maxY }, () =>
    Array.from({ length: maxX }, () => null)
  );

  // Populate grid with safety checks
  order.forEach(elementName => {
    const element = elements[elementName];
    if (element && element.xpos && element.ypos) {
      grid[element.ypos - 1][element.xpos - 1] = element;
    }
  });

  const getCategoryClass = (category) =>
    category
      ? category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '')
      : '';

  const renderGrid = () => {
    const cells = [];
    const hiddenPeriods = [8, 9, 10];
    
    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
      // Period label cell
      cells.push(
        <div
          className={`period-label${highlightedPeriod === rowIndex + 1 ? ' highlighted' : ''}`}
          key={`period-${rowIndex}`}
          onClick={() =>
            setHighlightedPeriod(highlightedPeriod === rowIndex + 1 ? null : rowIndex + 1)
          }
          style={{ cursor: 'pointer' }}
          title={`Highlight Period ${rowIndex + 1}`}
        >
          {hiddenPeriods.includes(rowIndex + 1) ? '' : rowIndex + 1}
        </div>
      );

      // Element or empty cells
      for (let colIndex = 0; colIndex < grid[rowIndex].length; colIndex++) {
        const element = grid[rowIndex][colIndex];
        
        // Lanthanide placeholder
        if (!element && rowIndex === 5 && colIndex === 2) {
          const blurred =
            (highlightedGroup && highlightedGroup !== 3) ||
            (highlightedPeriod && highlightedPeriod !== 6) ||
            (highlightedCategory && highlightedCategory !== 'lanthanide');
          cells.push(
            <div
              key={`la-placeholder-${rowIndex}-${colIndex}`}
              className={"empty-cell lanthanide-placeholder" + (blurred ? " blurred" : "")}
            >
              57–71<br />La
            </div>
          );
        }
        // Actinide placeholder
        else if (!element && rowIndex === 6 && colIndex === 2) {
          const blurred =
            (highlightedGroup && highlightedGroup !== 3) ||
            (highlightedPeriod && highlightedPeriod !== 7) ||
            (highlightedCategory && highlightedCategory !== 'actinide');
          cells.push(
            <div
              key={`ac-placeholder-${rowIndex}-${colIndex}`}
              className={"empty-cell actinide-placeholder" + (blurred ? " blurred" : "")}
            >
              89–103<br />Ac
            </div>
          );
        }
        // Regular element or empty cell
        else {
          cells.push(
            element ? (
              <Element
                key={element.number}
                element={element}
                onClick={() => handleElementClick(element)}
                highlighted={
                  (highlightedGroup && highlightedGroup === element.group) ||
                  (highlightedPeriod && element.ypos === highlightedPeriod) ||
                  (highlightedCategory &&
                    getCategoryClass(element.category) === highlightedCategory)
                }
                blurred={
                  (highlightedGroup && highlightedGroup !== element.group) ||
                  (highlightedPeriod && element.ypos !== highlightedPeriod) ||
                  (highlightedCategory &&
                    getCategoryClass(element.category) !== highlightedCategory)
                }
                onMouseEnter={() => handleMouseEnterElement(element)}
                onMouseLeave={handleMouseLeaveElement}
                showModels={showModels}
              />
            ) : (
              <div key={`empty-${rowIndex}-${colIndex}`} className="empty-cell"></div>
            )
          );
        }
      }
    }
    return cells;
  };

  return (
    <div className="periodic-table-container">
      <div className="group-labels">
        <div className="period-label" />
        {Array.from({ length: 18 }, (_, i) => {
          const groupNum = i + 1;
          return (
            <div
              className={`group-label${highlightedGroup === groupNum ? ' highlighted' : ''}`}
              key={groupNum}
              onClick={() => setHighlightedGroup(highlightedGroup === groupNum ? null : groupNum)}
              title={`Highlight Group ${groupNum}`}
            >
              {groupNum}
            </div>
          );
        })}
      </div>
      
      <div className="periodic-table">
        {renderGrid()}
        <div className={`gap-text ${!showGapText ? 'hidden' : ''}`}>
          The Periodic Table is a systematic arrangement of all known chemical elements, organized by their atomic number, electron configuration, and recurring chemical properties. It consists of <strong>119</strong> elements, divided into<strong>groups (vertical columns)</strong> and <strong>periods (horizontal rows)</strong>.
          Explore the elements by <strong>hovering or clicking</strong> on them to reveal detailed information about their properties, behaviors, and classifications. 
        </div>
      </div>
      
      {hoveredElement && (
        <>
          {showModels && (
          <div className="model-hover-box">  
            <div>
              <div><strong>Appearance:</strong> {hoveredElement.appearance}</div> 
              <div><strong>Phase:</strong> {hoveredElement.phase}</div> 
              <div><strong>Molar Heat (J/mol·K):</strong> {hoveredElement.molar_heat}</div>
            </div>
          </div>
          )}

          {!showModels && (
            <div className="atomic-hover-box">
              <div>
                <strong>{hoveredElement.name}</strong>
                <div><strong>Atomic Number:</strong> {hoveredElement.number}</div>
                <div><strong>Atomic Mass (u):</strong> {hoveredElement.atomic_mass}</div>
                <div><strong>Configuration:</strong> {hoveredElement.electron_configuration_semantic}</div>
              </div>
              {hoveredElement.image?.url && (
                <img 
                  src={hoveredElement.image.url} 
                  alt={hoveredElement.name}
                  className="atomic-hover-image"  
                />
              )}
            </div>
          )}
        </>
      )}

      {!showModels && (
        <div className="legend">
          {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
            <div
              key={cat}
              className={`legend-item ${cat}`}
              onClick={() => setHighlightedCategory(highlightedCategory === cat ? null : cat)}
              style={{ cursor: 'pointer' }}
              title={`Highlight all ${label}s`}
            >
              {label}
            </div>
          ))}
        </div>
      )}
      
      {showModal && selectedElement && (
        <ElementModal
          element={selectedElement}
          onClose={closeModal}
          showModels={showModels}
        />
      )}
    </div>
  );
};

export default PeriodicTable;