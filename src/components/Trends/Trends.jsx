import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Trends.css';
import Elements from '../../data/elements.json';
import ElementsRadii from '../../data/elements1.json';

const Trends = () => {
  const [activeTrend, setActiveTrend] = useState('atomicRadius');
  const [chartData, setChartData] = useState([]);
  const [highlightedElement, setHighlightedElement] = useState(null);

  useEffect(() => {
    try {
      const radiiMap = {};
      ElementsRadii.Elements.forEach(element => {
        radiiMap[element.AtomicNumber] = parseFloat(element.AtomicRadius) || 0;
      });

      const processed = Object.values(Elements)
        .map(element => ({
          name: element.name,
          symbol: element.symbol,
          atomicNumber: element.number,
          atomicRadius: radiiMap[element.number] || 0,
          electronegativity: element.electronegativity_pauling || 0,
          electronafinity: element.electron_affinity || 0,
          ionizationEnergy: element.ionization_energies?.[0] || 0,
          density: element.density || 0,
          meltingPoint: element.melt || 0,
          boilingPoint: element.boil || 0,
          group: element.group,
          period: element.period,
          block: element.block,
          originalElement: element
        }))
        .filter(element => element.atomicNumber)
        .sort((a, b) => a.atomicNumber - b.atomicNumber);

      setChartData(processed);
    } catch (error) {
      console.error('Data processing error:', error);
    }
  }, []);

  const getColor = (entry) => {
    if (highlightedElement && entry.symbol === highlightedElement.symbol) return '#ff0000';
    
    const trendColors = {
      atomicRadius: '#4e79a7',
      electronegativity: '#f28e2b',
      electronafinity: '#e15786',
      ionizationEnergy: '#e15759',
      density: '#76b7b2',
      meltingPoint: '#59a14f',
      boilingPoint: '#edc948'
    };
    
    return trendColors[activeTrend] || '#cccccc';
  };

  const getYAxisLabel = () => {
    return {
      atomicRadius: 'Atomic Radius (Å)',
      electronegativity: 'Electronegativity (Pauling)',
      ionizationEnergy: 'First Ionization Energy (kJ/mol)',
      density: 'Density (g/cm³)',
      meltingPoint: 'Melting Point (K)',
      boilingPoint: 'Boiling Point (K)',
      electronafinity: 'Electron Affinity (eV)'
    }[activeTrend];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const element = chartData.find(e => e.symbol === label);
      const value = payload[0].value;
      
      return (
        <div className="custom-tooltip">
          <p className="element-name">{element.name} ({label})</p>
          <p className="element-atomic">Atomic Number: {element.atomicNumber}</p>
          <p className="element-value">
            {trendLabels[activeTrend]}: {typeof value === 'number' ? value.toFixed(2) : value}
          </p>
          
          {activeTrend === 'ionizationEnergy' && element.originalElement.ionization_energies && (
            <div className="ionization-energies">
              <p>All Ionization Energies (kJ/mol):</p>
              <ul>
                {element.originalElement.ionization_energies.map((energy, i) => (
                  <li key={i}>{i+1}st: {energy}</li>
                ))}
              </ul>
            </div>
          )}
          
          <p className="element-group">Group: {element.group} | Period: {element.period}</p>
          <p className="element-block">Block: {element.block}</p>
        </div>
      );
    }
    return null;
  };

  const renderExtremes = () => {
    if (chartData.length === 0) return null;

    // Filter out undefined/null values
    const validData = chartData.filter(d => d[activeTrend] !== undefined && d[activeTrend] !== null);
    if (validData.length === 0) return <p>No valid data for this trend</p>;

    // Special handling for electron affinity
    if (activeTrend === 'electronafinity') {
      const maxValue = Math.max(...validData.map(d => d[activeTrend]));
      const minValue = Math.min(...validData.map(d => d[activeTrend]));

      const maxElement = validData.find(d => d[activeTrend] === maxValue);
      const minElement = validData.find(d => d[activeTrend] === minValue);

      return (
        <div className="extremes-container">
          <h3>Extreme Values</h3>
          <div className="extremes-grid">
            <div className="extreme-card highest">
              <h4>Most Positive</h4>
              <p className="extreme-value">{maxValue.toFixed(2)}</p>
              <p className="extreme-element">
                {maxElement.name} ({maxElement.symbol})
              </p>
              <p>Group {maxElement.group}, Period {maxElement.period}</p>
            </div>
            <div className="extreme-card lowest">
              <h4>Most Negative</h4>
              <p className="extreme-value">{minValue.toFixed(2)}</p>
              <p className="extreme-element">
                {minElement.name} ({minElement.symbol})
              </p>
              <p>Group {minElement.group}, Period {minElement.period}</p>
            </div>
          </div>
        </div>
      );
    }

    // For other properties where negative values might not make sense
    const positiveData = validData.filter(d => d[activeTrend] > 0);
    if (positiveData.length === 0) return <p>No positive data for this trend</p>;

    const maxValue = Math.max(...positiveData.map(d => d[activeTrend]));
    const minValue = Math.min(...positiveData.map(d => d[activeTrend]));

    const maxElement = positiveData.find(d => d[activeTrend] === maxValue);
    const minElement = positiveData.find(d => d[activeTrend] === minValue);

    return (
      <div className="extremes-container">
        <h3>Extreme Values</h3>
        <div className="extremes-grid">
          <div className="extreme-card highest">
            <h4>Highest</h4>
            <p className="extreme-value">{maxValue.toFixed(2)}</p>
            <p className="extreme-element">
              {maxElement.name} ({maxElement.symbol})
            </p>
            <p>Group {maxElement.group}, Period {maxElement.period}</p>
          </div>
          <div className="extreme-card lowest">
            <h4>Lowest</h4>
            <p className="extreme-value">{minValue.toFixed(2)}</p>
            <p className="extreme-element">
              {minElement.name} ({minElement.symbol})
            </p>
            <p>Group {minElement.group}, Period {minElement.period}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderMainChart = () => {
    if (chartData.length === 0) return <p>Loading data...</p>;

    return (
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
          onClick={(data) => {
            if (data && data.activeLabel) {
              const element = chartData.find(e => e.symbol === data.activeLabel);
              setHighlightedElement(element);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="symbol" 
            angle={-45} 
            textAnchor="end" 
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ 
              value: getYAxisLabel(), 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize: 14 }
            }} 
          />
          <Tooltip 
            content={<CustomTooltip activeTrend={activeTrend} />}
            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
          />
          <Legend />
          <Bar
            dataKey={activeTrend}
            name={trendLabels[activeTrend]}
            fill={(entry) => getColor(entry)}
            stroke={highlightedElement ? '#ff0000' : '#ffffff'}
            strokeWidth={highlightedElement ? 2 : 1}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const trendLabels = {
    atomicRadius: 'Atomic Radius (Å)',
    electronegativity: 'Electronegativity (Pauling)',
    electronafinity: 'Electron Affinity (eV)',
    ionizationEnergy: 'Ionization Energy',
    density: 'Density (g/cm³)',
    meltingPoint: 'Melting Point (K)',
    boilingPoint: 'Boiling Point (K)'
  };
   
  const trendExplanations = {
    atomicRadius: 'Atomic radius decreases across a period as nuclear charge increases, and increases down a group as more electron shells are added.',
    electronegativity: 'Electronegativity increases across a period and decreases down a group due to atomic size and nuclear pull.',
    electronafinity: 'Electron affinity generally increases across a period and decreases down a group, influenced by atomic size and electron shielding.',
    ionizationEnergy: 'Ionization energy generally increases across a period and decreases down a group due to electron shielding and atomic size.',
    density: 'Density depends on atomic mass and volume. It varies irregularly across periods but tends to increase down a group.',
    meltingPoint: 'Melting point trends vary depending on the type of element. Metals and non-metals show different periodic patterns.',
    boilingPoint: 'Boiling point follows similar trends to melting point but typically at higher temperatures, showing periodicity in elemental properties.'
  };

  return (
    <div className="trends-container">
      <div className="trend-selector">
        {Object.keys(trendLabels).map((trendKey) => (
          <button
            key={trendKey}
            onClick={() => {
              setActiveTrend(trendKey);
              setHighlightedElement(null);
            }}
            className={activeTrend === trendKey ? 'active' : ''}
          >
            {trendLabels[trendKey]}
          </button>
        ))}
      </div>

      <div className="chart-area">
        <div className="main-chart">
          {renderMainChart()}
          <div className="trend-explanation">
            <h3>About {trendLabels[activeTrend]}</h3>
            <p>{trendExplanations[activeTrend]}</p>
          </div>
        </div>
        <div className="sidebar">
          {renderExtremes()}
        </div>
      </div>
    </div>
  );
};

export default Trends;