// frontend/src/hooks/useSlangTitles.js
import { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const useSlangTitles = () => {
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await axios.get('/slangs/titles');
        const titlesList = response.data.map(slang => slang.title.toLowerCase());
        setTitles(titlesList);
      } catch (err) {
        setError('Hiba történt a szleng címek lekérése során.');
      } finally {
        setLoading(false);
      }
    };

    fetchTitles();
  }, []);

  return { titles, loading, error };
};

export default useSlangTitles;
