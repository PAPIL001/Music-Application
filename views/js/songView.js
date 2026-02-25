// songView.js — View Layer: Song list panel rendering

const songListDiv = document.getElementById('song-list');
const songListHeading = document.getElementById('song-list-heading');

/**
 * Renders a list of songs into the left panel.
 */
function renderSongList(songs, heading, onSongClick) {
    songListHeading.textContent = heading;
    songListDiv.innerHTML = '';

    if (!songs || songs.length === 0) {
        songListDiv.innerHTML = '<p class="empty-msg">No songs found.</p>';
        return;
    }

    songs.forEach((song, i) => {
        const item = document.createElement('div');
        item.classList.add('song-item');
        item.style.animationDelay = `${i * 30}ms`; // staggered fade-in
        item.innerHTML = `
            <img src="${song.img}" alt="${song.name}" class="song-thumb">
            <div class="song-meta">
                <span class="song-name">${song.name}</span>
                <span class="song-artist">${song.artist}</span>
            </div>
            <div class="eq-bars hidden">
                <span></span><span></span><span></span>
            </div>
        `;
        item.addEventListener('click', () => onSongClick(i));
        songListDiv.appendChild(item);
    });
}

/**
 * Shows a loading spinner + message in the song list panel.
 */
function showSongListMessage(message) {
    songListHeading.textContent = '';
    songListDiv.innerHTML = `
        <div class="spinner-wrap">
            <div class="spinner"></div>
            <p class="loading-msg">${message}</p>
        </div>
    `;
}

/**
 * Highlights the currently playing song and shows/hides equalizer bars.
 */
function highlightSong(index) {
    document.querySelectorAll('.song-item').forEach((el, i) => {
        const eq = el.querySelector('.eq-bars');
        if (i === index) {
            el.classList.add('active-song');
            eq?.classList.remove('hidden');
        } else {
            el.classList.remove('active-song');
            eq?.classList.add('hidden');
        }
    });
}
