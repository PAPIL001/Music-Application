const ITUNES_API_BASE = 'https://itunes.apple.com';

async function searchTracks(query, limit = 200) {
    const url = `${ITUNES_API_BASE}/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${limit}&country=US`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('iTunes API error');
    const data = await response.json();
    return formatTracks(data.results);
}

async function getFeaturedTracks() {
    return searchTracks('2024 hits', 200);
}

function formatTracks(tracks) {
    return tracks
        .filter(track => track.kind === 'song' && track.previewUrl)
        .map((track, index) => ({
            id: String(track.trackId),
            index,
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
