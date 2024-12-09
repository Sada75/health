import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import VoterPage from './components/VoterPage';
import UploadProjectPage from './components/UploadProjectPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/VoterPage" element={<VoterPage />} />
          <Route path="/UploadProjectPage" element={<UploadProjectPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
