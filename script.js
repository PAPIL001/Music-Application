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

// --- Data ---
let songs = [
    { id: 1, name: "Sugar", artist: "Maroon 5", img: "https://via.placeholder.com/150", genre: "Pop", source: "path/to/sugar.mp3" },
    { id: 2, name: "Locked Away", artist: "R City", img: "https://via.placeholder.com/150", genre: "Rock", source: "path/to/locked_away.mp3" },
    { id: 3, name: "Sugar-classical", artist: "Maroon 5", img: "https://via.placeholder.com/150", genre: "Classical", source: "path/to/sugar.mp3" },
    { id: 4, name: "Sugar-HipHop", artist: "Maroon 5", img: "https://via.placeholder.com/150", genre: "Hip Hop", source: "path/to/sugar.mp3" },
    { id: 5, name: "Sugar-Jazz", artist: "Maroon 5", img: "https://via.placeholder.com/150", genre: "Jazz", source: "path/to/sugar.mp3" }
];

let playlists = {};
let activePlaylistName = null;
let currentSongIndex = 0;
let isPlaying = false;

// --- Theme Toggle Logic ---
themeToggle.addEventListener("change", (e) => {
    // Instead of inline styles, we just swap a data attribute on the body
    if (e.target.checked) {
        document.body.setAttribute("data-theme", "light");
    } else {
        document.body.setAttribute("data-theme", "dark");
    }
});

// --- Core Functions ---
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
        // Note: mainAudio.play() will fail if the source path is fake
        // mainAudio.play().catch(e => console.log("Audio source not found"));
        playPauseBtn.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
        isPlaying = true;
    }
}

// --- Event Listeners ---

// Player Controls
playPauseBtn.addEventListener("click", () => togglePlay());

nextBtn.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    togglePlay(true);
});

prevBtn.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    togglePlay(true);
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
    
    // If we are currently viewing the playlist we just added to, re-render it
    if (viewTitle.textContent === activePlaylistName) {
        renderSongList(playlistArray, activePlaylistName);
    }
    
    // Subtle visual feedback instead of an alert
    addToPlaylistBtn.style.color = "var(--accent)";
    setTimeout(() => { addToPlaylistBtn.style.color = ""; }, 1000);
});

showAllBtn.addEventListener("click", () => {
    activePlaylistName = null;
    activePlaylistDisplay.textContent = "All Songs";
    renderSongList(songs, "All Songs");
});

// --- Initialization ---
loadSong(currentSongIndex);
renderSongList(songs);