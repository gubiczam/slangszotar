// models/Slang.js
const mongoose = require('mongoose');

const slangSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    definition: {
      type: String,
      required: true,
      trim: true,
    },
    example: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
      default: 'Anonim',
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Slang', slangSchema);
