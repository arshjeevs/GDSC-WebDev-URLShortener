const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    hitCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    dailyHits: { type: Array, default: [] } 
});

module.exports = mongoose.model('Url', UrlSchema);
