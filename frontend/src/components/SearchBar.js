import React from 'react';

function SearchBar({ searchTerm, setSearchTerm, handleSearch }) {
  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <form onSubmit={onSubmit} className="search-bar">
      <input 
        type="text" 
        placeholder="Keresés..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      <button type="submit">Keresés</button>
    </form>
  );
}

export default SearchBar;
