import React from 'react';
import './App.css';
import './index.css'
import NodeBuilder from './NodeBuilder';
import Home from './Home';
import {Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
      <div className="App">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<NodeBuilder />} />
        </Routes>
           
    </div>
  );
}

export default App;
