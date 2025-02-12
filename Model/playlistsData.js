const mongoose = require('mongoose')
const playlistSchema = mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
      createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model('Playlist', playlistSchema);
  