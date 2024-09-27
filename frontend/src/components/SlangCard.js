// frontend/src/components/SlangCard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../axiosConfig'; // Helyes import útvonal
import { 
  Button, 
  Typography, 
  Box, 
  Snackbar, 
  Alert 
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import useSlangTitles from '../hooks/useSlangTitles'; // Helyes import útvonal

function SlangCard({ slang }) {
  const [likes, setLikes] = useState(slang.likes);
  const [dislikes, setDislikes] = useState(slang.dislikes);
  const [userAction, setUserAction] = useState(null); // 'like', 'dislike', or null
  const [isProcessing, setIsProcessing] = useState(false); // API hívás állapota
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { titles, loading: titlesLoading, error: titlesError } = useSlangTitles();

  useEffect(() => {
    // Ellenőrizzük a localStorage-t a felhasználó akcióihoz
    const likedSlangs = JSON.parse(localStorage.getItem('likedSlangs')) || [];
    const dislikedSlangs = JSON.parse(localStorage.getItem('dislikedSlangs')) || [];

    if (likedSlangs.includes(slang._id)) {
      setUserAction('like');
    } else if (dislikedSlangs.includes(slang._id)) {
      setUserAction('dislike');
    }
  }, [slang._id]);

  const handleLike = async () => {
    if (isProcessing) return; // Megakadályozza a többszöri kattintást

    setIsProcessing(true);
    try {
      if (userAction === 'like') {
        // Visszavonjuk a like-ot
        await axios.patch(`/slangs/${slang._id}/unlike`);
        setLikes(Math.max(likes - 1, 0));
        setUserAction(null);
        setSnackbar({ open: true, message: 'Like visszavonva!', severity: 'info' });

        // Eltávolítjuk a like-ot a localStorage-ból
        const likedSlangs = JSON.parse(localStorage.getItem('likedSlangs')) || [];
        const updatedLikedSlangs = likedSlangs.filter(id => id !== slang._id);
        localStorage.setItem('likedSlangs', JSON.stringify(updatedLikedSlangs));
      } else {
        // Like-oljuk a szlenget
        await axios.patch(`/slangs/${slang._id}/like`);

        if (userAction === 'dislike') {
          setDislikes(Math.max(dislikes - 1, 0));
          // Eltávolítjuk a dislike-ot a localStorage-ból
          const dislikedSlangs = JSON.parse(localStorage.getItem('dislikedSlangs')) || [];
          const updatedDislikedSlangs = dislikedSlangs.filter(id => id !== slang._id);
          localStorage.setItem('dislikedSlangs', JSON.stringify(updatedDislikedSlangs));
          setSnackbar({ open: true, message: 'Like hozzáadva, dislike visszavonva!', severity: 'success' });
        } else {
          setSnackbar({ open: true, message: 'Like hozzáadva!', severity: 'success' });
        }

        setLikes(likes + 1);
        setUserAction('like');

        // Hozzáadjuk a like-ot a localStorage-hoz
        const likedSlangs = JSON.parse(localStorage.getItem('likedSlangs')) || [];
        likedSlangs.push(slang._id);
        localStorage.setItem('likedSlangs', JSON.stringify(likedSlangs));
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Hiba történt az akció során.', severity: 'error' });
    }
    setIsProcessing(false);
  };

  const handleDislike = async () => {
    if (isProcessing) return; // Megakadályozza a többszöri kattintást

    setIsProcessing(true);
    try {
      if (userAction === 'dislike') {
        // Visszavonjuk a dislike-ot
        await axios.patch(`/slangs/${slang._id}/undislike`);
        setDislikes(Math.max(dislikes - 1, 0));
        setUserAction(null);
        setSnackbar({ open: true, message: 'Dislike visszavonva!', severity: 'info' });
      } else {
        // Dislike-oljuk a szlenget
        await axios.patch(`/slangs/${slang._id}/dislike`);

        if (userAction === 'like') {
          setLikes(Math.max(likes - 1, 0));
          // Eltávolítjuk a like-ot a localStorage-ból
          const likedSlangs = JSON.parse(localStorage.getItem('likedSlangs')) || [];
          const updatedLikedSlangs = likedSlangs.filter(id => id !== slang._id);
          localStorage.setItem('likedSlangs', JSON.stringify(updatedLikedSlangs));
          setSnackbar({ open: true, message: 'Dislike hozzáadva, like visszavonva!', severity: 'success' });
        } else {
          setSnackbar({ open: true, message: 'Dislike hozzáadva!', severity: 'success' });
        }

        setDislikes(dislikes + 1);
        setUserAction('dislike');

        // Hozzáadjuk a dislike-ot a localStorage-hoz
        const dislikedSlangs = JSON.parse(localStorage.getItem('dislikedSlangs')) || [];
        dislikedSlangs.push(slang._id);
        localStorage.setItem('dislikedSlangs', JSON.stringify(dislikedSlangs));
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Hiba történt az akció során.', severity: 'error' });
    }
    setIsProcessing(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Segédfüggvény az interaktív szavak felismerésére és aláhúzására
  const renderTextWithLinks = (text) => {
    if (titlesLoading) return text; // Ha még töltődnek a címek, hagyjuk a szöveget változatlanul

    // Split the text into words, megtartva a szöveg közbeni szóközöket és írásjeleket
    const words = text.split(/(\s+|\b)/);

    return words.map((word, index) => {
      // Eltávolítjuk az írásjeleket a szó végéről
      const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').toLowerCase();

      if (titles.includes(cleanWord)) {
        // Keresünk a szleng címei között
        // Találtunk egyezést, ezért aláhúzzuk és kattinthatóvá tesszük
        return (
          <Link 
            key={index}
            to={`/slang/${slang._id}`} // Használjuk az id-t a navigációhoz
            style={{ textDecoration: 'underline', cursor: 'pointer', color: '#1976d2' }}
          >
            {word}
          </Link>
        );
      }

      return word; // Ha nincs egyezés, hagyjuk változatlanul
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        marginBottom: '2rem',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      <Typography 
        variant="h5" 
        component={Link} 
        to={`/slang/${slang._id}`} // Használjuk az id-t a navigációhoz
        sx={{ textDecoration: 'none', color: '#2c3e50', marginBottom: '1rem', display: 'block' }}
      >
        {slang.title}
      </Typography>
      <Typography variant="body1" sx={{ color: '#34495e' }}>
        {renderTextWithLinks(slang.definition)}
      </Typography>
      {slang.example && (
        <Typography variant="body2" sx={{ color: '#7f8c8d', fontStyle: 'italic', marginTop: '0.5rem' }}>
          Példa: {renderTextWithLinks(slang.example)}
        </Typography>
      )}
      <Typography 
        variant="subtitle2" 
        sx={{ color: '#7f8c8d', marginTop: '1rem' }}
      >
        Létrehozta: <Link to={`/author/${encodeURIComponent(slang.author)}`} style={{ textDecoration: 'underline', color: '#1976d2' }}>{slang.author}</Link>
      </Typography>
      <Box sx={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <Button
          variant={userAction === 'like' ? 'contained' : 'outlined'}
          color="primary"
          onClick={handleLike}
          disabled={isProcessing}
          startIcon={<ThumbUpIcon />}
        >
          Like {likes}
        </Button>
        <Button
          variant={userAction === 'dislike' ? 'contained' : 'outlined'}
          color="secondary"
          onClick={handleDislike}
          disabled={isProcessing}
          startIcon={<ThumbDownIcon />}
        >
          Dislike {dislikes}
        </Button>
      </Box>

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

export default SlangCard;
