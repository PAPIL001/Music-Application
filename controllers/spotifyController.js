// Controller: Handles HTTP requests and responses
// Delegates data fetching to the iTunes Model

const iTunesModel = require('../models/spotifyModel');

/**
 * GET /api/featured
 * Returns popular tracks from iTunes Search API.
 */
async function featured(req, res) {
    try {
        const tracks = await iTunesModel.getFeaturedTracks();
        res.json({ success: true, tracks });
    } catch (error) {
        console.error('[Controller] featured error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * GET /api/search?q=QUERY
 * Searches iTunes for tracks matching the query.
 */
async function search(req, res) {
    const query = req.query.q;

    if (!query || query.trim() === '') {
        return res.status(400).json({ success: false, error: 'Search query is required.' });
    }

    try {
        const tracks = await iTunesModel.searchTracks(query.trim());
        res.json({ success: true, tracks });
    } catch (error) {
        console.error('[Controller] search error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { featured, search };
