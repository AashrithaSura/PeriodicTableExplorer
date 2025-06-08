import React, { useState } from 'react';
import elementsData from '../../data/elements.json';
import './BlockView.css';

const blockColors = {
  s: '#90caf9',
  p: '#81c784',
  d: '#ffb74d',
  f: '#ba68c8'
};

const BlockView = () => {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);

  // Build a 2D grid for rows/columns
  const { order, ...elements } = elementsData;
  let maxX = 0;
  let maxY = 0;
  order.forEach(elementName => {
    const element = elements[elementName];
    maxX = Math.max(maxX, element.xpos);
    maxY = Math.max(maxY, element.ypos);
  });

  const grid = Array.from({ length: maxY }, () =>
    Array.from({ length: maxX }, () => null)
  );
  order.forEach(elementName => {
    const element = elements[elementName];
    grid[element.ypos - 1][element.xpos - 1] = element;
  });

  return (
    <div className="block-view-container">
      <div className="block-legend">
        {Object.entries(blockColors).map(([block, color]) => (
          <span
            key={block}
            className={`block-legend-item${selectedBlock === block ? ' selected' : ''}`}
            style={{ background: color }}
            onClick={() => setSelectedBlock(block)}
          >
            {block}-block
          </span>
        ))}
        {selectedBlock && (
          <button className="show-all-btn" onClick={() => setSelectedBlock(null)}>
            Show All
          </button>
        )}
      </div>
      {!selectedBlock && hoveredElement && (
        <div className="block-hover-card">
          <div><strong>Group:</strong> {hoveredElement.group || '—'}</div>
          <div><strong>Period:</strong> {hoveredElement.ypos || '—'}</div>
          <div><strong>Shells:</strong> {hoveredElement.shells ? hoveredElement.shells.join(', ') : '—'}</div>
        </div>
      )}
      <div className="block-table-grid">
        {grid.map((row, rowIndex) =>
          row.map((element, colIndex) => {
            if (!element) {
              return (
                <div
                  key={`empty-${rowIndex}-${colIndex}`}
                  className="block-table-cell empty-cell"
                ></div>
              );
            }
            const isInBlock = !selectedBlock || element.block === selectedBlock;
            return (
              <div
                key={element.name}
                className={`block-table-cell${isInBlock ? '' : ' faded'}`}
                style={{
                  background: isInBlock
                    ? blockColors[element.block]
                    : '#f5f5f5'
                }}
                onMouseEnter={() => setHoveredElement(element)}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <div className="element-symbol">{element.symbol}</div>
                <div className="element-number">{element.number}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BlockView;