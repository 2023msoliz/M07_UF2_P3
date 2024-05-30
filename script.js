document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const albumCover = document.getElementById('album-cover');
    const songTitle = document.getElementById('song-title');
    const artistName = document.getElementById('artist-name');
    const remainingTime = document.getElementById('remaining-time');
    const volumeSlider = document.getElementById('volume-slider');

    let currentSongIndex = 0;
    let songs = [];

    fetch('songs.json')
        .then(response => response.json())
        .then(data => {
            songs = data;
            loadSong(currentSongIndex);
        });

    function loadSong(index) {
        const song = songs[index];
        songTitle.textContent = song.name;
        artistName.textContent = song.artist;
        albumCover.src = song.img;
        audioPlayer.src = song.path;
        audioPlayer.volume = volumeSlider.value / 100;
        playBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
        albumCover.style.animationPlayState = 'paused';
        updateRemainingTime();
    }

    function updateRemainingTime() {
        audioPlayer.addEventListener('loadedmetadata', () => {
            const duration = audioPlayer.duration;
            audioPlayer.addEventListener('timeupdate', () => {
                const currentTime = audioPlayer.currentTime;
                const timeLeft = duration - currentTime;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = Math.floor(timeLeft % 60);
                remainingTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            });
        });
    }

    playBtn.addEventListener('click', () => {
        audioPlayer.play();
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
        albumCover.style.animationPlayState = 'running';
    });

    pauseBtn.addEventListener('click', () => {
        audioPlayer.pause();
        playBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
        albumCover.style.animationPlayState = 'paused';
    });

    nextBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
    });

    prevBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
    });

    volumeSlider.addEventListener('input', () => {
        audioPlayer.volume = volumeSlider.value / 100;
    });
});
