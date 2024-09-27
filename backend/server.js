const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Gondoskodj arról, hogy ez a sor a lehető legelső legyen

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Csatlakozás
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB kapcsolódva'))
  .catch(err => console.error(err));

// Route-ok
const slangRoutes = require('./routes/slang');
app.use('/api/slangs', slangRoutes);

// Index Route a teszteléshez
app.get('/', (req, res) => {
  res.send('SlangSzótár Backend');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server fut a ${PORT} porton`));
