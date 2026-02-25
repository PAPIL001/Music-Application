async function getFeaturedSongs() {
    const response = await fetch('/api/featured');
    const data = await response.json();
    return data;
}

async function searchSongs(query) {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data;
}
