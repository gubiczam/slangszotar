// UploadSlang.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Chip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  Link 
} from '@mui/material';
import { makeStyles, StylesProvider } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';

// Egyedi stílusok hozzáadása
const useStyles = makeStyles((theme) => ({
  guidelines: {
    backgroundColor: '#f9f9f9',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  tagInput: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  chip: {
    margin: '0.25rem',
  },
}));

function UploadSlang() {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const navigate = useNavigate();

  // State a szabályok dialog megnyitásához/zárásához
  const [openRules, setOpenRules] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/slangs', { title, definition, example, author, tags });
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setTagInput('');
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleOpenRules = () => {
    setOpenRules(true);
  };

  const handleCloseRules = () => {
    setOpenRules(false);
  };

  return (
    <StylesProvider injectFirst>
      <Container
        maxWidth="sm"
        style={{
          padding: '2rem',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h4" gutterBottom style={{ color: '#2c3e50' }}>
          Szleng Feltöltése
        </Typography>

        {/* Szabályok megjelenítéséhez szükséges link */}
        <Typography variant="body2" gutterBottom>
          <Link 
            component="button" 
            variant="body2" 
            onClick={handleOpenRules} 
            underline="always"
            sx={{ cursor: 'pointer' }}
          >
            Szabályok
          </Link>
        </Typography>

        {/* Szabályok Dialog */}
        <Dialog
          open={openRules}
          onClose={handleCloseRules}
          aria-labelledby="rules-dialog-title"
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle id="rules-dialog-title">
            Szabályok
            <IconButton
              aria-label="bezárás"
              onClick={handleCloseRules}
              style={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: '#888',
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="h6" gutterBottom>
              Minden definíciót az SlangSzotar-ban olyan emberek írták, mint te. Most itt a lehetőséged, hogy Te is hozzáadd a sajátodat!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Kérjük, ezeket a szabályokat tartsd be:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1">
                  <strong>Oszd meg olyan definíciókat, amelyeket mások értelmesnek találnak, és soha ne posztolj gyűlöletbeszédet vagy emberek személyes adatait.</strong>
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Írj egy széles közönség számára. Sok ember fogja olvasni, ezért adj meg némi háttérinformációt.</strong>
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Ne nevezd meg a barátaidat. Elutasítjuk a belső poénokat és a nem hírességek nevét tartalmazó definíciókat.</strong>
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Adj hozzá néhány címkét lent.</strong>
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>A definíciók a szolgáltatási feltételeink és az adatvédelmi szabályzatunk alá tartoznak.</strong>
                </Typography>
              </li>
            </ul>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRules} color="primary">
              Bezárás
            </Button>
          </DialogActions>
        </Dialog>

        {/* Feltöltő űrlap */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Slang"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Definíció"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={4}
            margin="normal"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
          />
          <TextField
            label="Példa (opcionális)"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={example}
            onChange={(e) => setExample(e.target.value)}
          />
          <TextField
            label="Szerző (opcionális)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          {/* Címke (Tags) mező */}
          <Box className={classes.tagInput} sx={{ marginTop: '1rem' }}>
            <Typography variant="body1" gutterBottom>
              Címkék hozzáadása:
            </Typography>
            <TextField
              label="Add hozzá a címkéket"
              variant="outlined"
              fullWidth
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              helperText="Nyomj Entert a címke hozzáadásához"
            />
            <Box className={classes.tagInput}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  className={classes.chip}
                  color="primary"
                />
              ))}
            </Box>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '1.5rem', padding: '0.75rem' }}
          >
            Feltöltés
          </Button>
        </Box>
      </Container>
    </StylesProvider>
  );
}

export default UploadSlang;
