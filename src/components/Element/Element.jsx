import React, { useState } from 'react'; // Changed to import useState
import './Element.css';

const Element = (props) => {
  const [isHovered, setIsHovered] = useState(false); // Added state for hover

  // Safety check at the VERY TOP
  if (!props.element) return null;

  // Destructure after null check
  const {
    element,
    onClick,
    highlighted,
    blurred,
    onMouseEnter,
    onMouseLeave,
    showModels
  } = props;

  const getCategoryClass = (category) => {
    if (!category) return '';
    return category.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z-]/g, '');
  };

  const categoryClass = getCategoryClass(element.category || '');

  return (
    <div
      className={
        `element ${!showModels ? categoryClass : ''} ${highlighted ? 'highlighted' : ''} ${blurred ? 'blurred' : ''} ${isHovered ? 'hovered' : ''}`
      }
      onClick={() => onClick && onClick(element)}
      onMouseEnter={() => {
        setIsHovered(true);
        onMouseEnter && onMouseEnter(element);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onMouseLeave && onMouseLeave();
      }}
      tabIndex={0}
      style={
        showModels && element['cpk-hex']
          ? { backgroundColor: `#${element['cpk-hex']}` }
          : undefined
      }
    >
      <div className="atomic-number">{element.number}</div>
      <div className="symbol">{element.symbol}</div>
    </div>
  );
};

export default Element;