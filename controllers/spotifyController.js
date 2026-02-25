const iTunesModel = require('../models/spotifyModel');

const getFeatured = async (req, res) => {
    try {
        const tracks = await iTunesModel.getFeaturedTracks();
        res.json(tracks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const search = async (req, res) => {
    const { q, limit } = req.query;
    try {
        const tracks = await iTunesModel.searchTracks(q, limit);
        res.json(tracks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getFeatured, search };
