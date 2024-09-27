// Header.js
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="navbar">
      <h1><Link to="/" style={{ color: '#ecf0f1', textDecoration: 'none' }}>SlangSzótár</Link></h1>
      <ul>
        <li><Link to="/">Főoldal</Link></li>
        <li><Link to="/upload">Szleng Feltöltése</Link></li>
      </ul>
    </nav>
  );
}

export default Header;
