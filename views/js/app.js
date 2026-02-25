// app.js — Frontend Entry Point

// ===== Featured Artist Data =====
const FEATURED_ARTISTS = [
    { name: 'Taylor Swift', emoji: '🌟', query: 'Taylor Swift', gradient: 'linear-gradient(135deg,#667eea,#764ba2)' },
    { name: 'The Weeknd', emoji: '🌙', query: 'The Weeknd', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)' },
    { name: 'Coldplay', emoji: '🌈', query: 'Coldplay', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
    { name: 'Eminem', emoji: '🎤', query: 'Eminem', gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)' },
    { name: 'Billie Eilish', emoji: '🕷️', query: 'Billie Eilish', gradient: 'linear-gradient(135deg,#1a1a2e,#16213e)' },
    { name: 'Ed Sheeran', emoji: '🎸', query: 'Ed Sheeran', gradient: 'linear-gradient(135deg,#f6d365,#fda085)' },
    { name: 'Drake', emoji: '👑', query: 'Drake', gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)' },
    { name: 'Ariana Grande', emoji: '✨', query: 'Ariana Grande', gradient: 'linear-gradient(135deg,#ff9a9e,#fecfef)' },
    { name: 'Bruno Mars', emoji: '🪐', query: 'Bruno Mars', gradient: 'linear-gradient(135deg,#fccb90,#d57eeb)' },
    { name: 'Dua Lipa', emoji: '💎', query: 'Dua Lipa', gradient: 'linear-gradient(135deg,#30cfd0,#330867)' },
    { name: 'BTS', emoji: '💜', query: 'BTS', gradient: 'linear-gradient(135deg,#0f0c29,#302b63)' },
    { name: 'Harry Styles', emoji: '🌸', query: 'Harry Styles', gradient: 'linear-gradient(135deg,#ee9ca7,#ffdde1)' },
];

// ===== State =====
let currentSongs = [];
let currentSongIndex = 0;
let playlists = {};
let activePlaylistName = null;
let isShuffled = false;
let repeatMode = false;
let currentView = 'home'; // 'home' | 'player'

// ===== DOM References =====
const themeToggle = document.getElementById('theme-toggle');
const homeBtn = document.getElementById('home-btn');
const headerSearchArea = document.getElementById('header-search-area');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const homeSearchInput = document.getElementById('home-search-input');
const homeSearchBtn = document.getElementById('home-search-btn');
const homeView = document.getElementById('home-view');
const homeHeading = document.getElementById('home-heading');
const artistGrid = document.getElementById('artist-grid');
const playerView = document.getElementById('player-view');
const showAllBtn = document.getElementById('show-all-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const addToPlaylistBtn = document.getElementById('add-to-playlist-btn');
const playlistInput = document.getElementById('playlist-input');
const createPlaylistBtn = document.getElementById('create-playlist-btn');
const activePlaylistDisplay = document.getElementById('active-playlist-display');
const allPlaylistsArea = document.getElementById('all-playlists-area');
const toastContainer = document.getElementById('toast-container');

// ===== Toast =====
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.classList.add('toast', `toast-${type}`);
    toast.textContent = message;
    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2800);
}

// ===== Theme =====
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('red-theme', themeToggle.checked);
});

// ===== View Switching =====
function switchToHomeView() {
    currentView = 'home';
    homeView.classList.remove('hidden');
    playerView.classList.add('hidden');
    homeBtn.classList.add('hidden');
    headerSearchArea.classList.add('hidden');
    // Music keeps playing — do NOT touch audioPlayer
}

function switchToPlayerView() {
    currentView = 'player';
    homeView.classList.add('hidden');
    playerView.classList.remove('hidden');
    homeBtn.classList.remove('hidden');
    headerSearchArea.classList.remove('hidden');
}

homeBtn.addEventListener('click', switchToHomeView);

// ===== Render Home Banner Grid =====
function renderHomePage() {
    artistGrid.innerHTML = '';
    FEATURED_ARTISTS.forEach((artist, i) => {
        const card = document.createElement('div');
        card.classList.add('artist-banner');
        card.style.background = artist.gradient;
        card.style.animationDelay = `${i * 60}ms`;
        card.innerHTML = `
            <span class="banner-emoji">${artist.emoji}</span>
            <span class="banner-name">${artist.name}</span>
            <div class="banner-overlay"><span>▶ Play</span></div>
        `;
        card.addEventListener('click', () => loadArtist(artist.name, artist.query));
        artistGrid.appendChild(card);
    });
}

// ===== Load Artist Songs =====
async function loadArtist(artistName, query) {
    switchToPlayerView();
    showSongListMessage(`Loading ${artistName}...`);
    try {
        const tracks = await searchSongs(query);
        currentSongs = tracks;
        currentSongIndex = 0;
        activePlaylistName = null;
        activePlaylistDisplay.textContent = 'None';
        renderSongList(tracks, `${artistName}`, playSong);
        if (tracks.length > 0) { updateCard(tracks[0]); highlightSong(0); }
    } catch (err) {
        showSongListMessage(`⚠️ ${err.message}`);
    }
}

// ===== Home Page Search =====
async function handleHomeSearch() {
    const query = homeSearchInput.value.trim();
    if (!query) return;
    switchToPlayerView();
    // Also copy query to header search input for UX continuity
    searchInput.value = query;
    showSongListMessage('Searching...');
    try {
        const tracks = await searchSongs(query);
        currentSongs = tracks;
        currentSongIndex = 0;
        activePlaylistName = null;
        activePlaylistDisplay.textContent = 'None';
        renderSongList(tracks, `Results: "${query}"`, playSong);
        if (tracks.length > 0) { updateCard(tracks[0]); highlightSong(0); }
        homeSearchInput.value = '';
    } catch (err) {
        showSongListMessage(`⚠️ ${err.message}`);
    }
}

homeSearchBtn.addEventListener('click', handleHomeSearch);
homeSearchInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleHomeSearch(); });

// ===== Header Search (player view) =====
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    showSongListMessage('Searching...');
    try {
        const tracks = await searchSongs(query);
        currentSongs = tracks;
        currentSongIndex = 0;
        activePlaylistName = null;
        activePlaylistDisplay.textContent = 'None';
        renderSongList(tracks, `Results: "${query}"`, playSong);
        if (tracks.length > 0) { updateCard(tracks[0]); highlightSong(0); }
    } catch (err) {
        showSongListMessage(`⚠️ ${err.message}`);
    }
}

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(); });

// ===== Show All =====
showAllBtn.addEventListener('click', async () => {
    activePlaylistName = null;
    activePlaylistDisplay.textContent = 'None';
    showSongListMessage('Loading top hits...');
    try {
        const tracks = await getFeaturedSongs();
        currentSongs = tracks;
        currentSongIndex = 0;
        renderSongList(tracks, 'Top Hits', playSong);
        if (tracks.length > 0) { updateCard(tracks[0]); highlightSong(0); }
    } catch (err) {
        showSongListMessage(`⚠️ ${err.message}`);
    }
});

// ===== Play Song =====
function playSong(index) {
    if (currentSongs.length === 0) return;
    currentSongIndex = index;
    updateCard(currentSongs[index]);
    highlightSong(index);
}

// ===== Auto-advance =====
audioPlayer.addEventListener('ended', () => {
    if (repeatMode) { audioPlayer.currentTime = 0; audioPlayer.play(); return; }
    const next = isShuffled
        ? Math.floor(Math.random() * currentSongs.length)
        : (currentSongIndex + 1) % currentSongs.length;
    playSong(next);
    audioPlayer.play().catch(() => { });
});

// ===== Navigation =====
nextBtn.addEventListener('click', () => {
    if (!currentSongs.length) return;
    const next = isShuffled ? Math.floor(Math.random() * currentSongs.length) : (currentSongIndex + 1) % currentSongs.length;
    playSong(next);
});
prevBtn.addEventListener('click', () => {
    if (!currentSongs.length) return;
    if (audioPlayer.currentTime > 3) { audioPlayer.currentTime = 0; return; }
    playSong((currentSongIndex - 1 + currentSongs.length) % currentSongs.length);
});

// ===== Shuffle & Repeat =====
shuffleBtn.addEventListener('click', () => {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('btn-active', isShuffled);
    showToast(isShuffled ? '🔀 Shuffle ON' : '🔀 Shuffle OFF');
});
repeatBtn.addEventListener('click', () => {
    repeatMode = !repeatMode;
    repeatBtn.classList.toggle('btn-active', repeatMode);
    showToast(repeatMode ? '🔁 Repeat ON' : '🔁 Repeat OFF');
});

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    switch (e.key) {
        case ' ': e.preventDefault(); audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause(); break;
        case 'ArrowRight': nextBtn.click(); break;
        case 'ArrowLeft': prevBtn.click(); break;
        case 'ArrowUp': e.preventDefault(); audioPlayer.volume = Math.min(1, audioPlayer.volume + 0.1); break;
        case 'ArrowDown': e.preventDefault(); audioPlayer.volume = Math.max(0, audioPlayer.volume - 0.1); break;
    }
});

// ===== Add to Playlist =====
addToPlaylistBtn.addEventListener('click', () => {
    if (!currentSongs.length) { showToast('No song is currently loaded', 'error'); return; }
    if (!activePlaylistName) { showToast('Select or create a playlist first', 'error'); return; }
    const song = currentSongs[currentSongIndex];
    const arr = playlists[activePlaylistName];
    if (arr.some(s => s.id === song.id)) { showToast('Song already in this playlist!', 'error'); return; }
    arr.push(song);
    showToast(`Added "${song.name}" to "${activePlaylistName}"`, 'success');
    if (currentView === 'player') renderSongList(arr, `Playlist: ${activePlaylistName}`, playSong);
});

// ===== Create Playlist =====
createPlaylistBtn.addEventListener('click', () => {
    const name = playlistInput.value.trim();
    if (!name) { showToast('Enter a playlist name', 'error'); return; }
    if (playlists[name]) { showToast('Playlist already exists!', 'error'); return; }
    playlists[name] = [];
    playlistInput.value = '';
    const item = document.createElement('p');
    item.classList.add('playlist-item');
    item.textContent = name;
    item.addEventListener('click', () => {
        activePlaylistName = name;
        activePlaylistDisplay.textContent = name;
        currentSongs = playlists[name];
        currentSongIndex = 0;
        renderSongList(playlists[name], `Playlist: ${name}`, playSong);
        if (playlists[name].length > 0) { updateCard(playlists[name][0]); highlightSong(0); }
    });
    allPlaylistsArea.appendChild(item);
    showToast(`Playlist "${name}" created!`, 'success');
});

// ===== Init =====
renderHomePage();
