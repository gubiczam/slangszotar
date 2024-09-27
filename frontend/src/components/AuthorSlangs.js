// frontend/src/components/AuthorSlangs.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../axiosConfig';
import { Typography, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import SlangCard from './SlangCard';

function AuthorSlangs() {
  const { author } = useParams();
  const [slangs, setSlangs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchAuthorSlangs = async () => {
      try {
        const response = await axios.get('/slangs', {
          params: {
            author: author.trim(),
          },
        });
        // Rendezés népszerűség alapján (likes descending)
        const sortedSlangs = response.data.sort((a, b) => b.likes - a.likes);
        setSlangs(sortedSlangs);
      } catch (err) {
        setError('Hiba történt a szerző szlengjeinek lekérése során.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorSlangs();
  }, [author]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center" sx={{ marginTop: '2rem' }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
        {author} Által Létrehozott Szlengek
      </Typography>

      {slangs.length > 0 ? (
        slangs.map(slang => (
          <SlangCard key={slang._id} slang={slang} />
        ))
      ) : (
        <Typography variant="body1">
          {author} nem hozott létre még szleng kifejezést.
        </Typography>
      )}

      {/* Snackbar Visszajelzések */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AuthorSlangs;
