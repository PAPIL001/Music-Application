// --- DOM Elements ---
const themeToggle = document.getElementById("theme-toggle");
const allSongsDiv = document.getElementById("all-song-div");
const viewTitle = document.getElementById("view-title");
const activePlaylistDisplay = document.getElementById("active-playlist-display");

// Player Elements
const mainAudio = document.getElementById("main-audio");
const cardImage = document.getElementById("card-image");
const cardTitle = document.getElementById("card-title");
const cardArtist = document.getElementById("card-artist");
const playPauseBtn = document.getElementById("play-pause-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const addToPlaylistBtn = document.getElementById("add-to-playlist-btn");

// Playlist Elements
const playlistInput = document.getElementById("playlist-input");
const createPlaylistBtn = document.getElementById("create-playlist-btn");
const allPlaylistsList = document.getElementById("all-playlists-list");
const showAllBtn = document.getElementById("show-all-btn");

// --- Application State Data ---
let songs = [];
let playlists = {};
let activePlaylistName = null;
let currentSongIndex = 0;
let isPlaying = false;


// Change this in script.js
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api/songs' 
    : 'https://your-render-app-name.onrender.com/api/songs';
    
// --- Core Functions ---
async function initializeApp() {
    try {
        const response = await fetch('http://localhost:3000/api/songs');
        const data = await response.json();
        
        // Update our global songs array with the real Spotify data
        songs = data;

        // Render the UI
        renderSongList(songs, "Global Top Tracks");
        
        if(songs.length > 0) {
            currentSongIndex = 0;
            loadSong(currentSongIndex);
        }

    } catch (error) {
        console.error("Failed to load data from backend:", error);
        allSongsDiv.innerHTML = "<p>Error loading songs. Is the backend server running on port 3000?</p>";
    }
}

function renderSongList(songList, title = "All Songs") {
    allSongsDiv.innerHTML = "";
    viewTitle.textContent = title;

    if (songList.length === 0) {
        allSongsDiv.innerHTML = "<p style='grid-column: 1/-1; color: var(--text-secondary);'>No songs here yet.</p>";
        return;
    }

    songList.forEach((song) => {
        // Create a Spotify-like card for each song
        const card = document.createElement("div");
        card.className = "song-card";
        
        card.innerHTML = `
            <img src="${song.img}" alt="${song.name}">
            <h4>${song.name}</h4>
            <p>${song.artist}</p>
        `;

        card.addEventListener("click", () => {
            const globalIndex = songs.findIndex(s => s.id === song.id);
            if (globalIndex !== -1) {
                currentSongIndex = globalIndex;
                loadSong(currentSongIndex);
                togglePlay(true);
            }
        });

        allSongsDiv.appendChild(card);
    });
}

function loadSong(index) {
    if (songs.length === 0) return; // Safety check
    
    const song = songs[index];
    mainAudio.src = song.source;
    cardImage.src = song.img;
    cardTitle.textContent = song.name;
    cardArtist.textContent = song.artist;
    
    // Reset play button icon
    playPauseBtn.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
    isPlaying = false;
}

function togglePlay(forcePlay = false) {
    if (isPlaying && !forcePlay) {
        mainAudio.pause();
        playPauseBtn.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
        isPlaying = false;
    } else {
        // Uncommented this so the Spotify previews actually play!
        mainAudio.play().catch(e => console.log("Audio play blocked by browser or source invalid:", e));
        playPauseBtn.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
        isPlaying = true;
    }
}

// --- Event Listeners ---

// Theme Toggle Logic
themeToggle.addEventListener("change", (e) => {
    if (e.target.checked) {
        document.body.setAttribute("data-theme", "light");
    } else {
        document.body.setAttribute("data-theme", "dark");
    }
});

// Player Controls
playPauseBtn.addEventListener("click", () => togglePlay());

nextBtn.addEventListener("click", () => {
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    togglePlay(true);
});

prevBtn.addEventListener("click", () => {
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    togglePlay(true);
});

// Audio element listener to auto-play next song when current finishes
mainAudio.addEventListener("ended", () => {
    nextBtn.click();
});

// Playlist Management
createPlaylistBtn.addEventListener("click", () => {
    const playlistName = playlistInput.value.trim();
    if (playlistName) {
        if (playlists[playlistName]) {
            alert("Playlist already exists!");
            return;
        }
        
        playlists[playlistName] = [];
        
        const li = document.createElement("li");
        li.innerHTML = `<i class="fa-solid fa-list-ul"></i> ${playlistName}`;
        
        li.addEventListener("click", () => {
            activePlaylistName = playlistName;
            activePlaylistDisplay.textContent = playlistName;
            renderSongList(playlists[playlistName], playlistName);
        });

        allPlaylistsList.appendChild(li);
        playlistInput.value = "";
    }
});

addToPlaylistBtn.addEventListener("click", () => {
    if (!activePlaylistName) {
        alert("Please create or select a playlist from the sidebar first to add songs.");
        return;
    }

    const songToAdd = songs[currentSongIndex];
    const playlistArray = playlists[activePlaylistName];

    if (playlistArray.some(s => s.id === songToAdd.id)) {
        alert("Song is already in this playlist!");
        return;
    }

    playlistArray.push(songToAdd);
    
    if (viewTitle.textContent === activePlaylistName) {
        renderSongList(playlistArray, activePlaylistName);
    }
    
    addToPlaylistBtn.style.color = "var(--accent)";
    setTimeout(() => { addToPlaylistBtn.style.color = ""; }, 1000);
});

showAllBtn.addEventListener("click", () => {
    activePlaylistName = null;
    activePlaylistDisplay.textContent = "All Songs";
    renderSongList(songs, "All Songs");
});

// --- Initialization ---
// Call this once at the very end to boot up the app and fetch data
initializeApp();
