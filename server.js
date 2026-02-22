require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.static(__dirname));

let spotifyToken = null;
let tokenExpirationTime = null;

// Breaking strings to prevent URL-rewriting filters from breaking the code
const TOKEN_URL = 'https://' + 'accounts.spotify.com' + '/api/token';
const API_URL = 'https://' + 'api.spotify.com' + '/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks?limit=15';

async function getSpotifyToken() {
    if (spotifyToken && Date.now() < tokenExpirationTime) {
        return spotifyToken; 
    }

    const credentials = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

    const response = await axios({
        method: 'post',
        url: TOKEN_URL,
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'grant_type=client_credentials'
    });

    spotifyToken = response.data.access_token;
    tokenExpirationTime = Date.now() + (response.data.expires_in - 60) * 1000; 
    return spotifyToken;
}

app.get('/api/songs', async (req, res) => {
    try {
        // 1. Try to get the real Spotify data
        const token = await getSpotifyToken();
        const spotifyResponse = await axios.get(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const fallbackAudio = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
        const formattedSongs = spotifyResponse.data.items
            .map((item, index) => ({
                id: index + 1,
                name: item.track.name,
                artist: item.track.artists.map(a => a.name).join(', '),
                img: item.track.album.images[0]?.url || "https://via.placeholder.com/150",
                source: item.track.preview_url || fallbackAudio 
            }));

        console.log("Successfully fetched from Spotify API!");
        res.json(formattedSongs);

    } catch (error) {
        // 2. If Spotify blocks us (403), log the error and serve MOCK DATA instead
        console.warn(`Spotify API blocked the request (${error.response?.status || error.message}). Serving fallback data...`);
        
        const mockFallbackData = [
            { id: 1, name: "Blinding Lights", artist: "The Weeknd", img: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
            { id: 2, name: "Shape of You", artist: "Ed Sheeran", img: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
            { id: 3, name: "Starboy", artist: "The Weeknd, Daft Punk", img: "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
            { id: 4, name: "Dance Monkey", artist: "Tones And I", img: "https://i.scdn.co/image/ab67616d0000b273c3af831d102046bf7ea32152", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
            { id: 5, name: "Rockstar", artist: "Post Malone, 21 Savage", img: "https://i.scdn.co/image/ab67616d0000b273b1c4b76e23414c9f20242268", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" }
        ];

        res.json(mockFallbackData);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});