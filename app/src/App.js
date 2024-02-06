import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/home.js';
import Connect from './pages/connect.js';
import Dashboard from './pages/dashboard.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<Home />} />
        <Route path="connect" element={<Connect />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
