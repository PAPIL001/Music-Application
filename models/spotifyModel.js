// Model: Handles all iTunes Search API communication
// No API key required — iTunes Search API is completely public

const ITUNES_API_BASE = 'https://itunes.apple.com';

/**
 * Searches iTunes for tracks matching a query.
 * @param {string} query - Search term
 * @param {number} limit - Number of results (max 200)
 * @returns {Array} Cleaned track array
 */
async function searchTracks(query, limit = 200) {
    const url = `${ITUNES_API_BASE}/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${limit}&country=US`;

    console.log('[iTunesModel] Search URL:', url);

    const response = await fetch(url);

    if (!response.ok) {
        const err = await response.text();
        console.error('[iTunesModel] Search error:', err);
        throw new Error(`iTunes search error: ${response.status}`);
    }

    const data = await response.json();
    return formatTracks(data.results);
}

/**
 * Gets featured/popular tracks shown on app load.
 * Uses a general 'top hits' search.
 * @returns {Array} Cleaned track array
 */
async function getFeaturedTracks() {
    return searchTracks('top hits', 200);
}

/**
 * Normalizes iTunes track objects to our app's format.
 * Only includes tracks that have a 30-second preview clip.
 * @param {Array} tracks - Raw iTunes result objects
 * @returns {Array} Cleaned track array
 */
function formatTracks(tracks) {
    return tracks
        .filter(track => track.kind === 'song' && track.previewUrl)
        .map((track, index) => ({
            id: String(track.trackId),
            index: index,
            name: track.trackName,
            artist: track.artistName,
            album: track.collectionName || 'Unknown Album',
            img: track.artworkUrl100?.replace('100x100', '300x300') || '',
            preview_url: track.previewUrl,
            genre: track.primaryGenreName || '',
            duration_ms: track.trackTimeMillis || 0,
        }));
}

module.exports = { searchTracks, getFeaturedTracks };
