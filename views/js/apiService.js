// apiService.js — View Layer: API communication
// Fetches data from our Express server endpoints

/**
 * Fetches featured/top tracks from the server on app load.
 * @returns {Promise<Array>} Array of track objects
 */
async function getFeaturedSongs() {
    const response = await fetch('/api/featured');
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch featured songs');
    return data.tracks;
}

/**
 * Searches for tracks by query string.
 * @param {string} query
 * @returns {Promise<Array>} Array of track objects
 */
async function searchSongs(query) {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Search failed');
    return data.tracks;
}
