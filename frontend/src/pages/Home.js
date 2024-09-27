// Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SlangCard from '../components/SlangCard';
import SearchBar from '../components/SearchBar';

function Home() {
  const [slangs, setSlangs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('trend'); // 'trend' vagy 'latest'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSlangs();
  }, [sortBy]);

  const fetchSlangs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/slangs?sortBy=${sortBy}`);
      setSlangs(res.data);
    } catch (err) {
      console.error(err);
      setError('Hiba történt az adatok betöltésekor.');
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/slangs?search=${searchTerm}`);
      setSlangs(res.data);
    } catch (err) {
      console.error(err);
      setError('Hiba történt a keresés során.');
    }
    setLoading(false);
  };

  return (
    <div>
      <SearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
      />
      <div className="sort-options">
        <button 
          onClick={() => setSortBy('trend')} 
          className={sortBy === 'trend' ? 'active' : ''}
        >
          Trend
        </button>
        <button 
          onClick={() => setSortBy('latest')} 
          className={sortBy === 'latest' ? 'active' : ''}
        >
          Legújabb
        </button>
      </div>
      {loading ? (
        <p>Betöltés...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div className="slang-list">
          {slangs.length > 0 ? (
            slangs.map(slang => (
              <SlangCard key={slang._id} slang={slang} />
            ))
          ) : (
            <p>Nincs találat.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
