// DOM Elements
const homePage = document.getElementById('homePage');
const playerPage = document.getElementById('playerPage');
const songListElement = document.getElementById('songList');
const backToHomeBtn = document.getElementById('backToHomeBtn');

const audioPlayer = document.getElementById('audioPlayer');
const albumArtPlayer = document.getElementById('albumArt');
const playerTrackTitle = document.getElementById('playerTrackTitle');
const playerTrackArtist = document.getElementById('playerTrackArtist');
const lyricsContainer = document.getElementById('lyricsContainer');

const playerProgressBarContainer = document.getElementById('playerProgressBarContainer');
const playerProgressBar = document.getElementById('playerProgressBar');
const playerCurrentTime = document.getElementById('playerCurrentTime');
const playerTotalDuration = document.getElementById('playerTotalDuration');

const playerPrevBtn = document.getElementById('playerPrevBtn');
const playerPlayPauseBtn = document.getElementById('playerPlayPauseBtn');
const playerNextBtn = document.getElementById('playerNextBtn');
const playerRepeatBtn = document.getElementById('playerRepeatBtn');
const playerShuffleBtn = document.getElementById('playerShuffleBtn');
const playerVolumeSlider = document.getElementById('playerVolumeSlider');

// App State
let songs = [ // Anda perlu mengganti ini dengan data lagu Anda
    {
        id: 1,
        title: "Consume",
        artist: "Chase atlantic",
        albumArtUrl: "https://tse3.mm.bing.net/th?id=OIP.VwivM--7Xx_SmgsqXBLi8AAAAA&pid=Api&P=0&h=220",
        audioSrc: "audio/consume.mp3", // GANTI DENGAN PATH FILE AUDIO ANDA
        lyrics: `She said, Careful, or you'll lose it\nBut, girl, I'm only human,\nAnd I know there's a blade where your heart is\nAnd you know how to use it\nAnd you can take my flesh if you want girl\nBut, baby, don't abuse it (Calm down)\nThese voices in my head screaming, Run now (Don't run)\nI'm praying that they're human`
    },
    {
        id: 2,
        title: "Perfect",
        artist: "ED Sheeran",
        albumArtUrl: "https://tse4.mm.bing.net/th?id=OIP.TjS4z1jJTsl6K3-ADIXFywHaEK&pid=Api&P=0&h=220",
        audioSrc: "audio/Ed Sheeran - Perfect.mp3", // GANTI DENGAN PATH FILE AUDIO ANDA
        lyrics: `I found a love for me\nOh, darlin', just dive right in and follow my lead\nWell, I found a girl, beautiful and sweet\nOh, I never knew you were the someone waitin' for me\n'Cause we were just kids when we fell in love\nNot knowin' what it was\nI will not give you up this time\nBut, darlin', just kiss me slow\nYour heart is all I own\nAnd in your eyes, you're holdin' mine`
    },   
    {
        id: 3,
        title: "Unconditionally",
        artist: "Katy Perry",
        albumArtUrl: "https://i.ytimg.com/vi/4NGVxU0qhZ8/maxresdefault.jpg",
        audioSrc: "audio/Katy Perry - Unconditionally.mp3", // GANTI DENGAN PATH FILE AUDIO ANDA
        lyrics: `Oh no, did I get too close?\nOh, did I almost see what's really on the inside?\nAll your insecurities\nAll the dirty laundry\nNever made me blink one time\nUnconditional, unconditionally\nI will love you unconditionally\nThere is no fear now\nLet go and just be free\nI will love you unconditionally\nSo come just as you are to me\nDon't need apologies\nKnow that you are worthy\nI'll take your bad days with your good\nWalk through the storm, I would\nI'd do it all because I love you\nI love you\nUnconditional, unconditionally\nI will love you unconditionally\nThere is no fear now\nLet go and just be free\nI will love you unconditionally`
    }
];
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0: no repeat, 1: repeat one, 2: repeat all

// --- Page Navigation ---
function showPlayerPage() {
    homePage.classList.remove('active');
    playerPage.classList.add('active');
}

function showHomePage() {
    playerPage.classList.remove('active');
    homePage.classList.add('active');
    pauseTrack(); // Jeda musik saat kembali ke home
}

// --- Home Page Logic ---
function renderSongList() {
    songListElement.innerHTML = ''; // Kosongkan daftar sebelum mengisi
    if (songs.length === 0) {
        songListElement.innerHTML = '<li class="loading-songs">Tidak ada lagu tersedia.</li>';
        return;
    }
    songs.forEach((song, index) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-id', song.id);
        listItem.innerHTML = `
            <img src="${song.albumArtUrl}" alt="${song.title}" class="song-art-list">
            <div class="song-info-list">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            </div>
        `;
        listItem.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(songs[currentSongIndex]);
            playTrack();
            showPlayerPage();
        });
        songListElement.appendChild(listItem);
    });
}

// --- Player Logic ---
function loadSong(song) {
    if (!song) {
        console.error("Lagu tidak ditemukan!");
        // Set UI ke default jika lagu tidak ada
        albumArtPlayer.src = "https://placehold.co/100x100/3a3a4e/e0e0e0?text=Error";
        playerTrackTitle.textContent = "Lagu Tidak Tersedia";
        playerTrackArtist.textContent = "-";
        lyricsContainer.textContent = "Lirik tidak tersedia.";
        audioPlayer.src = "";
        playerCurrentTime.textContent = "0:00";
        playerTotalDuration.textContent = "0:00";
        playerProgressBar.style.width = "0%";
        return;
    }
    albumArtPlayer.src = song.albumArtUrl;
    playerTrackTitle.textContent = song.title;
    playerTrackArtist.textContent = song.artist;
    lyricsContainer.textContent = song.lyrics || "Lirik tidak tersedia untuk lagu ini.";
    audioPlayer.src = song.audioSrc;

    audioPlayer.onloadedmetadata = () => {
        playerTotalDuration.textContent = formatTime(audioPlayer.duration);
    };
    audioPlayer.load(); // Penting untuk memuat setelah src diubah
    updatePlayPauseIcon();
}

function playTrack() {
    if (!audioPlayer.src || audioPlayer.src === window.location.href) { // Cek jika src kosong atau hanya URL halaman
        if (songs.length > 0) { // Jika ada lagu di playlist, coba muat yang pertama
            loadSong(songs[currentSongIndex]);
        } else {
            console.log("Tidak ada lagu untuk dimainkan.");
            return;
        }
    }
    isPlaying = true;
    audioPlayer.play().catch(error => console.error("Error saat play:", error));
    updatePlayPauseIcon();
}

function pauseTrack() {
    isPlaying = false;
    audioPlayer.pause();
    updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
    if (isPlaying) {
        playerPlayPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        playerPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function prevTrack() {
    if (songs.length === 0) return;
    if (isShuffle) {
        playRandomTrack();
    } else {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    }
    loadSong(songs[currentSongIndex]);
    playTrack();
}

function nextTrackLogic() {
    if (songs.length === 0) return;
    if (isShuffle) {
        playRandomTrack();
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    loadSong(songs[currentSongIndex]);
    playTrack();
}

function nextTrack() { // Dipanggil oleh tombol next dan event 'ended'
    if (songs.length === 0) return;

    if (repeatMode === 1 && audioPlayer.ended) { // Repeat One (hanya jika lagu selesai secara alami)
        audioPlayer.currentTime = 0;
        playTrack();
    } else if (isShuffle) {
        playRandomTrack();
    } else {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            if (repeatMode === 2) { // Repeat All
                currentSongIndex = 0;
            } else { // No repeat all, and not repeat one
                currentSongIndex = songs.length - 1; // Tetap di lagu terakhir
                loadSong(songs[currentSongIndex]); // Muat info lagu terakhir
                pauseTrack(); // Jeda di akhir playlist
                audioPlayer.currentTime = audioPlayer.duration; // Set ke akhir untuk UI
                return;
            }
        }
        loadSong(songs[currentSongIndex]);
        playTrack();
    }
}


function playRandomTrack() {
    if (songs.length <= 1) { // Jika hanya 1 lagu atau tidak ada, mainkan seperti biasa
        currentSongIndex = 0;
    } else {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * songs.length);
        } while (randomIndex === currentSongIndex); // Pastikan tidak mengulang lagu yang sama berturut-turut
        currentSongIndex = randomIndex;
    }
    loadSong(songs[currentSongIndex]);
    playTrack();
}


// Update progress bar & time
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        playerProgressBar.style.width = `${progressPercent}%`;
        playerCurrentTime.textContent = formatTime(audioPlayer.currentTime);
        // Total duration di set di onloadedmetadata
    }
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Seek on progress bar
playerProgressBarContainer.addEventListener('click', (e) => {
    if (!audioPlayer.duration || songs.length === 0) return;
    const width = playerProgressBarContainer.clientWidth;
    const clickX = e.offsetX;
    audioPlayer.currentTime = (clickX / width) * audioPlayer.duration;
});

// Volume control
playerVolumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value;
});

// Shuffle button
playerShuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    playerShuffleBtn.classList.toggle('active-feature', isShuffle);
    console.log("Shuffle: " + isShuffle);
});

// Repeat button
playerRepeatBtn.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3; // 0: none, 1: one, 2: all
    updateRepeatButtonUI();
    console.log("Repeat Mode: " + repeatMode);
});

function updateRepeatButtonUI() {
    playerRepeatBtn.classList.remove('active-feature'); // Hapus dulu kelas aktif
    audioPlayer.loop = false; // Default loop false

    if (repeatMode === 0) { // No repeat
        playerRepeatBtn.innerHTML = '<i class="fas fa-repeat"></i>';
    } else if (repeatMode === 1) { // Repeat one
        playerRepeatBtn.innerHTML = '<i class="fas fa-repeat-1"></i>'; // Pastikan Font Awesome mendukung ini
        playerRepeatBtn.classList.add('active-feature');
        audioPlayer.loop = true; // HTML5 audio loop untuk repeat one
    } else { // Repeat all (mode 2)
        playerRepeatBtn.innerHTML = '<i class="fas fa-repeat"></i>';
        playerRepeatBtn.classList.add('active-feature');
        // audioPlayer.loop = false; // Loop dikelola oleh fungsi nextTrack
    }
}


// Event Listeners for controls
playerPlayPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
});
playerPrevBtn.addEventListener('click', prevTrack);
playerNextBtn.addEventListener('click', nextTrackLogic); // Menggunakan nextTrackLogic untuk tombol

// Song ended listener
audioPlayer.addEventListener('ended', () => {
    if (repeatMode === 1) { // Jika repeat one aktif, audio.loop sudah menanganinya
        // Tidak perlu melakukan apa-apa di sini karena audio.loop=true akan memutar ulang
        // Namun, jika ingin logika tambahan, bisa ditaruh di sini.
        // Untuk konsistensi, kita bisa panggil playTrack() lagi
        // audioPlayer.currentTime = 0; // pastikan mulai dari awal
        // playTrack();
    } else {
        nextTrack(); // Panggil nextTrack yang menangani repeat all dan no repeat
    }
});


// Back to home button
backToHomeBtn.addEventListener('click', showHomePage);

// --- Initialization ---
function init() {
    renderSongList();
    if (songs.length > 0) {
        loadSong(songs[currentSongIndex]); // Muat lagu pertama tapi jangan langsung play
    } else {
        // Tampilan jika tidak ada lagu sama sekali
        albumArtPlayer.src = "https://placehold.co/100x100/3a3a4e/e0e0e0?text=Musik";
        playerTrackTitle.textContent = "Tidak Ada Lagu";
        playerTrackArtist.textContent = "Tambahkan lagu";
        lyricsContainer.textContent = "Silakan tambahkan lagu dari daftar.";
    }
    audioPlayer.volume = playerVolumeSlider.value;
    updatePlayPauseIcon();
    updateRepeatButtonUI();
    showHomePage(); // Mulai dari halaman daftar lagu
}

// Panggil init saat script dimuat
init();
