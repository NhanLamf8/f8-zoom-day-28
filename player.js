const $ = document.querySelector.bind(document);
const player = {
  playlist: $(".playlist"),
  togglePlayElement: $(".btn-toggle-play"),
  playingSongTitleElement: $(".song-title"),
  audioElement: $("#audio"),
  playIcon: $(".playIcon"),
  cdThumb: $(".cd-thumb"),
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
  currentIndex: 0,
  start() {
    this.render();
    this.loadCurrentSong();
    this.togglePlayElement.onclick = this.tongglePlay.bind(this);

    this.audioElement.onplay = () => {
      this.playIcon.classList.remove("fa-play");
      this.playIcon.classList.add("fa-pause");
    };
    this.audioElement.onpause = () => {
      this.playIcon.classList.remove("fa-pause");
      this.playIcon.classList.add("fa-play");
    };
  },
  loadCurrentSong() {
    const currentSong = this.getCurentSong();
    this.playingSongTitleElement.textContent = currentSong.name;
    this.audioElement.src = currentSong.path;
    this.cdThumb.style.backgroundImage = `url('${currentSong.image}')`;
  },
  getCurentSong() {
    return this.songs[this.currentIndex];
  },
  tongglePlay() {
    // const currentSong = this.getCurentSong();
    if (this.audioElement.paused) {
      this.audioElement.play();
    } else this.audioElement.pause();
  },
  render() {
    const html = this.songs
      .map((song, index) => {
        return `<div class="song ${
          index === this.currentIndex ? "active" : ""
        }">
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
  },
};

player.start();
