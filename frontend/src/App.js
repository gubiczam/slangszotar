import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import SlangDetail from './pages/SlangDetail';
import UploadSlang from './pages/UploadSlang';
import AuthorSlangs from './components/AuthorSlangs';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
        <Route path="/slang/:title" element={<SlangDetail />} />
        <Route path="/author/:author" element={<AuthorSlangs />} />
          <Route path="/slang/:id" element={<SlangDetail />} />
          <Route path="/upload" element={<UploadSlang />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
