import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import PeriodicTable from "./components/PeriodicTable/PeriodicTable";
import BlockView from './components/BlockView/BlockView';
import Trends from './components/Trends/Trends'; 
import ElementDetails from './components/ElementDetails/ElementDetails';
import SearchBar from './components/SearchBar/SearchBar';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>Interactive Periodic Table</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/models">Models</Link>
        <Link to="/blocks">Blocks</Link>
        <Link to="/trends">Trends</Link>
        <Link to="/elements/:identifier">Atomic Profile</Link>
      </nav>
      <Routes>
        <Route path="/" element={<PeriodicTable showModels={false} />} />
        <Route path="/models" element={<PeriodicTable showModels={true} />} />
        <Route path="/blocks" element={<BlockView />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/elements/:identifier" element={
          <div>
            <SearchBar />
            <ElementDetails />
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;