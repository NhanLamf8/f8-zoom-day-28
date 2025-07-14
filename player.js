const $ = document.querySelector.bind(document);
const player = {
  playlist: $(".playlist"),
  togglePlayElement: $(".btn-toggle-play"),
  playingSongTitleElement: $(".song-title"),
  audioElement: $("#audio"),
  playIcon: $(".playIcon"),
  cdThumb: $(".cd-thumb"),
  prevSongElement: $(".btn-prev"),
  nextSongElement: $(".btn-next"),
  repeatElement: $(".btn-repeat"),
  shuffleElement: $(".btn-random"),
  progressElement: $(".progress"),
  volume: $(".volume-range-vertical"),
  volumeIcon: $(".volume-vertical i"),
  isPlaying: false,
  isLoop: localStorage.getItem("loop") === "true",
  isShuffle: localStorage.getItem("shuffle") === "true",

  songs: [
    {
      id: 1,
      name: "Bang Bang Bang",
      singer: "Bigbang",
      path: "./songs/Bang Bang Bang.mp3",
      image: "./imgs/bigbang1.jpg",
    },

    {
      id: 2,
      name: "Blue",
      singer: "Bigbang",
      image: "./imgs/bigbang2.jpg",
      path: "./songs/Blue.mp3",
    },
    {
      id: 3,
      name: "Fantastic Baby",
      singer: "Bigbang",
      image: "./imgs/bigbang3.jpg",
      path: "./songs/Fantastic Baby.mp3",
    },
    {
      id: 4,
      name: "Haru Haru",
      singer: "Bigbang",
      image: "./imgs/bigbang4.jpg",
      path: "./songs/Haru Haru.mp3",
    },
    {
      id: 5,
      name: "Still Life",
      singer: "Bigbang",
      image: "./imgs/bigbang5.jpg",
      path: "./songs/Still Life.mp3",
    },
    {
      id: 6,
      name: "Tell Me Goodbye",
      singer: "Bigbang",
      image: "./imgs/bigbang6.jpg",
      path: "./songs/Tell Me Goodbye.mp3",
    },
    {
      id: 7,
      name: "Tonight",
      singer: "Bigbang",
      image: "./imgs/bigbang7.jpg",
      path: "./songs/Tonight.mp3",
    },
  ],
  currentIndex:
    localStorage.getItem("currentIndex") !== null
      ? Number(localStorage.getItem("currentIndex"))
      : 0,
  start() {
    this.render();
    this.loadCurrentSong();
    this.togglePlayElement.onclick = this.tongglePlay.bind(this);

    // Thêm phần tử progress

    if (this.progressElement) {
      // Cập nhật thanh tiến trình khi phát nhạc
      this.audioElement.ontimeupdate = () => {
        if (this.audioElement.duration) {
          const percent =
            (this.audioElement.currentTime / this.audioElement.duration) * 100;
          this.progressElement.value = percent;
        }
      };
      // Tua nhạc khi kéo thanh tiến trình
      this.progressElement.oninput = (e) => {
        if (this.audioElement.duration) {
          const seekTime = (e.target.value / 100) * this.audioElement.duration;
          this.audioElement.currentTime = seekTime;
        }
      };
    }

    this.audioElement.onplay = () => {
      this.playIcon.classList.remove("fa-play");
      this.playIcon.classList.add("fa-pause");
      this.isPlaying = true;
      this.cdThumb.classList.add("playing");
    };
    this.audioElement.onpause = () => {
      this.playIcon.classList.remove("fa-pause");
      this.playIcon.classList.add("fa-play");
      this.isPlaying = false;
      this.cdThumb.classList.remove("playing");
    };

    this.audioElement.onended = () => {
      if (this.isLoop) {
        this.audioElement.play();
      } else {
        this.nextSongElement.onclick();
        this.audioElement.play();
      }
    };

    this.prevSongElement.onclick = () => {
      this.currentIndex--;
      this.handleNextandPrev();
    };
    this.nextSongElement.onclick = () => {
      this.currentIndex++;
      this.handleNextandPrev();
    };
    this.repeatElement.onclick = () => {
      this.isLoop = !this.isLoop;
      this.setLoopstate();
      localStorage.setItem("loop", this.isLoop);
    };
    this.shuffleElement.onclick = () => {
      this.isShuffle = !this.isShuffle;
      this.setShuffleState();
      localStorage.setItem("shuffle", this.isShuffle);
    };
    this.setShuffleState();

    if (this.volume) {
      let savedVolume = localStorage.getItem("playerVolume");
      if (savedVolume !== null) {
        this.volume.value = savedVolume;
        this.audioElement.volume = Number(savedVolume) / 100;
      } else {
        this.volume.value = 100;
        this.audioElement.volume = 1;
      }

      if (Number(this.volume.value) === 0) {
        this.volumeIcon.classList.add("fa-volume-mute");
        this.volumeIcon.classList.remove("fa-volume-up");
      } else {
        this.volumeIcon.classList.remove("fa-volume-mute");
        this.volumeIcon.classList.add("fa-volume-up");
      }

      this.volume.oninput = (e) => {
        const value = Number(e.target.value);
        this.audioElement.volume = value / 100;
        localStorage.setItem("playerVolume", value);

        if (value === 0) {
          this.volumeIcon.classList.add("fa-volume-mute");
          this.volumeIcon.classList.remove("fa-volume-up");
        } else {
          this.volumeIcon.classList.remove("fa-volume-mute");
          this.volumeIcon.classList.add("fa-volume-up");
        }
      };

      this.volumeIcon.onclick = () => {
        if (this.audioElement.volume > 0) {
          this.audioElement.volume = 0;
          this.volume.value = 0;
          this.volumeIcon.classList.add("fa-volume-mute");
          this.volumeIcon.classList.remove("fa-volume-up");
          localStorage.setItem("playerVolume", 0);
        } else {
          this.audioElement.volume = 1;
          this.volume.value = 100;
          this.volumeIcon.classList.remove("fa-volume-mute");
          this.volumeIcon.classList.add("fa-volume-up");
          localStorage.setItem("playerVolume", 100);
        }
      };
    }
  },

  setShuffleState() {
    this.shuffleElement.classList.toggle("active", this.isShuffle);
  },

  handleNextandPrev() {
    if (this.isShuffle) {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * this.songs.length);
      } while (newIndex === this.currentIndex && this.songs.length > 1);
      this.currentIndex = newIndex;
    } else {
      this.currentIndex =
        (this.currentIndex + this.songs.length) % this.songs.length;
    }
    this.loadCurrentSong();
    this.render();
  },
  setLoopstate() {
    this.audioElement.loop = this.isLoop;
    this.repeatElement.classList.toggle("active", this.isLoop);
  },
  loadCurrentSong() {
    const currentSong = this.getCurentSong();
    this.playingSongTitleElement.textContent = currentSong.name;
    this.audioElement.src = currentSong.path;
    this.cdThumb.style.backgroundImage = `url('${currentSong.image}')`;
    this.setLoopstate();
    localStorage.setItem("currentIndex", this.currentIndex);
    this.audioElement.oncanplay = () => {
      if (player.isPlaying) {
        this.audioElement.play();
      }
    };
  },
  getCurentSong() {
    return this.songs[this.currentIndex];
  },
  tongglePlay() {
    if (this.audioElement.paused) {
      this.audioElement.play();
    } else this.audioElement.pause();
  },

  render() {
    const html = this.songs
      .map((song, index) => {
        return `<div class="song ${
          index === this.currentIndex ? "active" : ""
        }" data-index="${index}">
          <div
            class="thumb"
            style="
              background-image: url('${song.image}');
            "
          ></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>`;
      })
      .join("");

    this.playlist.innerHTML = html;

    // scoll to active song
    setTimeout(() => {
      const activeSong = this.playlist.querySelector(".song.active");
      if (activeSong) {
        activeSong.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);

    const songElements = this.playlist.querySelectorAll(".song");
    songElements.forEach((song) => {
      song.onclick = () => {
        const index = Number(song.getAttribute("data-index"));
        if (index !== this.currentIndex) {
          this.currentIndex = index;
          this.loadCurrentSong();
          this.render();
          this.audioElement.play();
        }
      };
    });
  },
};

player.start();
