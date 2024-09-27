// routes/slang.js
const express = require('express');
const router = express.Router();
const Slang = require('../models/Slang');

// GET /api/slangs - Összes szleng lekérése
router.get('/', async (req, res) => {
    try {
      const { search, sortBy, tags, author } = req.query;
      let query = {};
  
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { definition: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
        ];
      }
  
      if (tags) {
        const tagsArray = tags.split(',').map(tag => tag.trim());
        query.tags = { $all: tagsArray };
      }
  
      if (author) {
        query.author = { $regex: `^${author.trim()}$`, $options: 'i' }; // Egyezés pontosan a szerző nevével, nem case-sensitive
      }
  
      let sortCriteria = {};
      if (sortBy === 'trend') {
        sortCriteria = { likes: -1, dislikes: 1 };
      } else if (sortBy === 'latest') {
        sortCriteria = { createdAt: -1 };
      }
  
      const slangs = await Slang.find(query).sort(sortCriteria);
      res.status(200).json(slangs);
    } catch (error) {
      res.status(500).json({ error: 'Hiba történt a szleng lekérése során.' });
    }
  });
  
// GET /api/slangs/:id - Egy adott szleng lekérése
router.get('/:id', async (req, res) => {
  try {
    const slang = await Slang.findById(req.params.id);
    if (!slang) {
      return res.status(404).json({ error: 'Szleng nem található.' });
    }
    res.status(200).json(slang);
  } catch (error) {
    res.status(500).json({ error: 'Hiba történt a szleng lekérése során.' });
  }
});

// POST /api/slangs - Új szleng hozzáadása
router.post('/', async (req, res) => {
  try {
    const { title, definition, example, author, tags } = req.body;
    const existingSlang = await Slang.findOne({ title: title.trim() });
    if (existingSlang) {
      return res.status(400).json({ error: 'Ez a szleng már létezik.' });
    }

    const newSlang = new Slang({
      title: title.trim(),
      definition: definition.trim(),
      example: example ? example.trim() : '',
      author: author ? author.trim() : 'Anonim',
      tags: tags || [],
    });

    const savedSlang = await newSlang.save();
    res.status(201).json(savedSlang);
  } catch (error) {
    res.status(500).json({ error: 'Hiba történt a szleng hozzáadása során.' });
  }
});

// PATCH /api/slangs/:id/like - Like hozzáadása
router.patch('/:id/like', async (req, res) => {
  try {
    const slang = await Slang.findById(req.params.id);
    if (!slang) {
      return res.status(404).json({ error: 'Szleng nem található.' });
    }
    slang.likes += 1;
    await slang.save();
    res.status(200).json(slang);
  } catch (error) {
    res.status(500).json({ error: 'Hiba történt a like hozzáadása során.' });
  }
});

// PATCH /api/slangs/:id/unlike - Like visszavonása
router.patch('/:id/unlike', async (req, res) => {
  try {
    const slang = await Slang.findById(req.params.id);
    if (!slang) {
      return res.status(404).json({ error: 'Szleng nem található.' });
    }
    slang.likes = Math.max(slang.likes - 1, 0);
    await slang.save();
    res.status(200).json(slang);
  } catch (error) {
    res.status(500).json({ error: 'Hiba történt a like visszavonása során.' });
  }
});

// PATCH /api/slangs/:id/dislike - Dislike hozzáadása
router.patch('/:id/dislike', async (req, res) => {
  try {
    const slang = await Slang.findById(req.params.id);
    if (!slang) {
      return res.status(404).json({ error: 'Szleng nem található.' });
    }
    slang.dislikes += 1;
    await slang.save();
    res.status(200).json(slang);
  } catch (error) {
    res.status(500).json({ error: 'Hiba történt a dislike hozzáadása során.' });
  }
});

// PATCH /api/slangs/:id/undislike - Dislike visszavonása
router.patch('/:id/undislike', async (req, res) => {
  try {
    const slang = await Slang.findById(req.params.id);
    if (!slang) {
      return res.status(404).json({ error: 'Szleng nem található.' });
    }
    slang.dislikes = Math.max(slang.dislikes - 1, 0);
    await slang.save();
    res.status(200).json(slang);
  } catch (error) {
    res.status(500).json({ error: 'Hiba történt a dislike visszavonása során.' });
  }
});

// GET /api/slangs/titles - Összes szleng címe lekérése
router.get('/titles', async (req, res) => {
    try {
      const titles = await Slang.find({}, 'title').lean();
      res.status(200).json(titles);
    } catch (error) {
      res.status(500).json({ error: 'Hiba történt a szleng címek lekérése során.' });
    }
  });

// Exportáljuk az útvonalakat
module.exports = router;
