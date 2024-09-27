// frontend/src/pages/SlangDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../axiosConfig';
import { Typography, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import SlangCard from '../components/SlangCard';

function SlangDetail() {
  const { title } = useParams();
  const [slang, setSlang] = useState(null);
  const [relatedSlangs, setRelatedSlangs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedError, setRelatedError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchSlang = async () => {
      try {
        const response = await axios.get(`/slangs/${encodeURIComponent(title)}`);
        setSlang(response.data);
      } catch (err) {
        setError('Hiba történt a szleng lekérése során.');
      } finally {
        setLoading(false);
      }
    };

    fetchSlang();
  }, [title]);

  useEffect(() => {
    if (!slang) return;

    const fetchRelatedSlangs = async () => {
      try {
        // Példa: Kapcsolódó szlengek keresése közös címkék alapján
        const response = await axios.get('/slangs', {
          params: {
            tags: slang.tags.join(','), // Feltételezve, hogy a backend támogatja a tags filterezést
          },
        });
        // Szűrés, hogy ne tartalmazza magát a szlenget
        const filtered = response.data.filter(item => item.title.toLowerCase() !== slang.title.toLowerCase());
        // Rendezés népszerűség alapján (likes descending)
        filtered.sort((a, b) => b.likes - a.likes);
        setRelatedSlangs(filtered);
      } catch (err) {
        setRelatedError('Hiba történt a kapcsolódó szlengek lekérése során.');
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelatedSlangs();
  }, [slang]);

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
      <SlangCard slang={slang} />
      
      <Typography variant="h6" sx={{ marginTop: '2rem', marginBottom: '1rem' }}>
        Kapcsolódó Szlengek
      </Typography>

      {relatedLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <CircularProgress />
        </Box>
      ) : relatedError ? (
        <Typography variant="body1" color="error">
          {relatedError}
        </Typography>
      ) : relatedSlangs.length > 0 ? (
        relatedSlangs.map(relSlang => (
          <SlangCard key={relSlang._id} slang={relSlang} />
        ))
      ) : (
        <Typography variant="body1">
          Nincsenek kapcsolódó szlengek.
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

export default SlangDetail;
