import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import "./styles/HomePage.css";
// import "./styles/VoterPage.css";
// import "./styles/UploadProjectPage.css";
import HomePage from './components/HomePage';
import VoterPage from './components/VoterPage';
import UploadProjectPage from './components/UploadProjectPage';



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
