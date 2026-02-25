// playerView.js — View Layer: Now-playing card rendering

const cardImage = document.getElementById('card-image');
const cardTitle = document.getElementById('card-title');
const cardArtist = document.getElementById('card-artist');
const cardAlbum = document.getElementById('card-album');
const audioPlayer = document.getElementById('audio-player');
const noPreviewMsg = document.getElementById('no-preview-msg');

// ===== Vinyl spin: start/stop based on audio play/pause =====
audioPlayer.addEventListener('play', () => cardImage.classList.add('spinning'));
audioPlayer.addEventListener('pause', () => cardImage.classList.remove('spinning'));
audioPlayer.addEventListener('ended', () => cardImage.classList.remove('spinning'));

/**
 * Updates the now-playing card with a track's data.
 * @param {Object} song - Track object
 */
function updateCard(song) {
    // Fade out → update → fade in
    cardImage.classList.add('card-fade');
    setTimeout(() => {
        cardImage.src = song.img || '';
        cardImage.alt = song.name;
        cardTitle.textContent = song.name;
        cardArtist.textContent = `Artist: ${song.artist}`;
        cardAlbum.textContent = `Album: ${song.album}`;
        cardImage.classList.remove('card-fade');
    }, 200);

    // Stop spin before loading new song
    cardImage.classList.remove('spinning');

    audioPlayer.src = song.preview_url;
    audioPlayer.load();
    audioPlayer.classList.remove('hidden');
    noPreviewMsg.classList.add('hidden');
}

/**
 * Resets the card to its initial empty state.
 */
function resetCard() {
    cardImage.src = '';
    cardTitle.textContent = 'Select a song';
    cardArtist.textContent = '';
    cardAlbum.textContent = '';
    audioPlayer.src = '';
    cardImage.classList.remove('spinning');
}
