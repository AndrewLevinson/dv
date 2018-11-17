// to dos
// experiment with background changing color. Sequential red scale for # of nuclear tests?
// update music player style
// length of song should be percentage of that decade's total tests. i.e, 1 minue presentation means that in year[i] there were  #tests / total #tests x 60 seconds
// typography

// data sets

let songs = [];
let currentSong = 0;

const display = {
  0: "four",
  1: "five",
  2: "six",
  3: "seven",
  4: "eight",
  5: "nine",
  6: "twenty",
  7: "twentyTen"
};

const volumeLevel = {
  0: 0.2,
  1: 0.4,
  2: 0.6,
  3: 0.8,
  4: 1,
  5: 0.5,
  6: 0.2,
  7: 0.1
};

// music data
const music = d3.csv("data/music.csv", d => {
  songs.push({
    decade: d["decade"],
    artist: d["artist"],
    song: d["song"],
    path: d["path"]
  });
});

// load nuclear data
// us data
const usaData = d3
  .csv("data/decades/usa_decade.csv", d => {
    return {
      tests: +d["tests"],
      decade: d["decade"]
    };
  })
  .then(data => {
    // console.log(data);
    usaChart(data);
  });

// russia data
const russiaData = d3
  .csv("data/decades/russia_decade.csv", d => {
    return {
      tests: +d["tests"],
      decade: d["decade"]
    };
  })
  .then(data => {
    // console.log(data);
    russiaChart(data);
  });

// all other country data
const othersData = d3
  .csv("data/decades/others_decade.csv", d => {
    return {
      tests: +d["tests"],
      decade: d["decade"]
    };
  })
  .then(data => {
    // console.log(data);
    othersChart(data);
  });

music.then(() => {
  // console.log(songs[currentSong].path);
  // variables for current decade focus
  // const thumbnails = document.querySelectorAll(".decade");
  const player = document.getElementById("player");
  const nowPlayingText = document.getElementById("now-playing");
  function preloadAudio(path) {
    var audio = new Audio();
    // once this file loads, it will call loadedAudio()
    // the file will be kept by the browser as cache
    audio.addEventListener("canplaythrough", loadedAudio, false);
    audio.src = path;
  }

  let loaded = 0;
  function loadedAudio() {
    // this will be called every time an audio file is loaded
    // we keep track of the loaded files vs the requested files
    loaded++;
    if (loaded == songs.length) {
      // all have loaded
      init();
    }
  }

  function play(index) {
    player.src = songs[index].path;
    player.volume = volumeLevel[index];
    console.log(player.volume);
    player.currentTime = 15;
    player.play();
  }

  function init() {
    // once the player ends, play the next one
    player.onended = function() {
      // thumbnails[currentSong].classList.remove("playing");
      currentSong++;
      displaySong();
      setDisplay();
      // thumbnails[currentSong].classList.add("playing");
      if (currentSong >= songs.length) {
        // end
        return;
      }
      play(currentSong);
    };
    // play the first file
    play(currentSong);
    // set the first thumbnail playing class
    // thumbnails[currentSong].classList.add("playing");
    // set the first set of active blocks
    var items = document.querySelectorAll(`.${display[currentSong]}`);
    for (var i = 0; i < items.length; i++) {
      items[i].classList.add("playing");
    }
  }

  // set playing class for all active test blocks
  function setDisplay() {
    var oldItems = document.querySelectorAll(`.${display[currentSong - 1]}`);
    console.log(oldItems);

    for (var i = 0; i < oldItems.length; i++) {
      oldItems[i].classList.remove("playing");
    }
    var items = document.querySelectorAll(`.${display[currentSong]}`);
    console.log(items);
    for (var i = 0; i < items.length; i++) {
      items[i].classList.add("playing");
    }
  }

  // update text for song now playing
  function displaySong() {
    let content = `${songs[currentSong].decade}'s: ${
      songs[currentSong].song
    } // ${songs[currentSong].artist}`;
    nowPlayingText.innerHTML = content;
  }
  displaySong();

  // we start preloading all the audio files
  for (let currentSong in songs) {
    preloadAudio(songs[currentSong].path);
  }
});

// use data to display
// define globals
const usa = document.querySelector(".usa");
const russia = document.querySelector(".russia");
const others = document.querySelector(".others");

// usa blocks
let usaChart = data => {
  // waffle chart code
  const normalize = d3.range(100);
  const numbers = d3.range(data[8]["tests"]);
  const fourties = d3.range(Math.round((data[0]["tests"] / 1030) * 100));
  const fifties = d3.range(Math.round((data[1]["tests"] / 1030) * 100));
  const sixties = d3.range(Math.round((data[2]["tests"] / 1030) * 100));
  const seventies = d3.range(Math.floor((data[3]["tests"] / 1030) * 100));
  const eighties = d3.range(Math.round((data[4]["tests"] / 1030) * 100));
  const nineties = d3.range(Math.round((data[5]["tests"] / 1030) * 100));
  const twenty = d3.range(Math.round((data[6]["tests"] / 1030) * 100));
  const twentyTen = d3.range(Math.round((data[7]["tests"] / 1030) * 100));
  // console.log(eighties);
  // console.log(numbers.length);
  // console.log(twentyTen);
  // console.log(twenty);
  // console.log(nineties);
  // console.log(eighties);
  // console.log(seventies);
  // console.log(sixties);
  // console.log(fifties);
  // console.log(fourties);

  // try to get playing class to toggle on
  // const niners = document.querySelectorAll(".nine")[0];
  // console.log(niners);
  // d3.select(niners).on("click", function() {
  //   console.log(this);
  //   d3.selectAll(niners)
  //     .selectAll("div")
  //     .classed("inactive", true);
  //   d3.select(this).classed("playing", true);
  // });

  //
  fourties.forEach(d => {
    let div = document.createElement("div");
    usa.appendChild(div);
    div.classList.add("four");
  });
  fifties.forEach(d => {
    let div = document.createElement("div");
    usa.appendChild(div);
    div.classList.add("five");
  });

  sixties.forEach(d => {
    let div = document.createElement("div");
    usa.appendChild(div);
    div.classList.add("six");
  });

  seventies.forEach(d => {
    let div = document.createElement("div");
    usa.appendChild(div);
    div.classList.add("seven");
  });
  eighties.forEach(d => {
    let div = document.createElement("div");
    usa.appendChild(div);
    div.classList.add("eight");
  });
  nineties.forEach(d => {
    let div = document.createElement("div");
    usa.appendChild(div);
    div.classList.add("nine");
  });
  twenty.forEach(d => {
    let div = document.createElement("div");
    usa.appendChild(div);
    div.classList.add("twenty");
  });
  twentyTen.forEach(d => {
    let div = document.createElement("div");
    usa.appendChild(div);
    div.classList.add("twentyTen");
  });

  // let div = document.createElement("div");
  // content.appendChild(div);
  // div.classList.add("item");

  // usa
  //   .selectAll("div")
  //   .data(twentyTen)
  //   .enter()
  //   .append("div")
  //   .attr("class", "twentyTen");
};

// russia blocks
let russiaChart = data => {
  // waffle chart code
  const normalize = d3.range(100);
  const numbers = d3.range(Math.round((data[8]["tests"] / 715) * 100));
  const fourties = d3.range(Math.round((data[0]["tests"] / 715) * 100));
  const fifties = d3.range(Math.round((data[1]["tests"] / 715) * 100));
  const sixties = d3.range(Math.round((data[2]["tests"] / 715) * 100));
  const seventies = d3.range(Math.round((data[3]["tests"] / 715) * 100));
  const eighties = d3.range(Math.ceil((data[4]["tests"] / 715) * 100));
  const nineties = d3.range(Math.round((data[5]["tests"] / 715) * 100));
  const twenty = d3.range(Math.round((data[6]["tests"] / 715) * 100));
  const twentyTen = d3.range(Math.round((data[7]["tests"] / 715) * 100));
  // console.log(twentyTen);
  // console.log(twenty);
  // console.log(nineties);
  // console.log(eighties);
  // console.log(seventies);
  // console.log(sixties);
  // console.log(fifties);
  // console.log(fourties);
  fourties.forEach(d => {
    let div = document.createElement("div");
    russia.appendChild(div);
    div.classList.add("four");
  });
  fifties.forEach(d => {
    let div = document.createElement("div");
    russia.appendChild(div);
    div.classList.add("five");
  });
  sixties.forEach(d => {
    let div = document.createElement("div");
    russia.appendChild(div);
    div.classList.add("six");
  });
  seventies.forEach(d => {
    let div = document.createElement("div");
    russia.appendChild(div);
    div.classList.add("seven");
  });
  eighties.forEach(d => {
    let div = document.createElement("div");
    russia.appendChild(div);
    div.classList.add("eight");
  });
  nineties.forEach(d => {
    let div = document.createElement("div");
    russia.appendChild(div);
    div.classList.add("nine");
  });

  twenty.forEach(d => {
    let div = document.createElement("div");
    russia.appendChild(div);
    div.classList.add("twenty");
  });
  twentyTen.forEach(d => {
    let div = document.createElement("div");
    russia.appendChild(div);
    div.classList.add("twentyTen");
  });
};

// others blocks
let othersChart = data => {
  // waffle chart code
  const normalize = d3.range(100);
  const numbers = d3.range(Math.round((data[8]["tests"] / 331) * 100));
  const fourties = d3.range(Math.ceil((data[0]["tests"] / 331) * 100));
  const fifties = d3.range(Math.ceil((data[1]["tests"] / 331) * 100));
  const sixties = d3.range(Math.ceil((data[2]["tests"] / 331) * 100) + 1);
  const seventies = d3.range(Math.ceil((data[3]["tests"] / 331) * 100) + 1);
  const eighties = d3.range(Math.ceil((data[4]["tests"] / 331) * 100) + 1);
  const nineties = d3.range(Math.ceil((data[5]["tests"] / 331) * 100));
  const twenty = d3.range(Math.ceil((data[6]["tests"] / 331) * 100));
  const twentyTen = d3.range(Math.ceil((data[7]["tests"] / 331) * 100));

  fourties.forEach(d => {
    let div = document.createElement("div");
    others.appendChild(div);
    div.classList.add("four");
  });

  fifties.forEach(d => {
    let div = document.createElement("div");
    others.appendChild(div);
    div.classList.add("five");
  });

  sixties.forEach(d => {
    let div = document.createElement("div");
    others.appendChild(div);
    div.classList.add("six");
  });

  seventies.forEach(d => {
    let div = document.createElement("div");
    others.appendChild(div);
    div.classList.add("seven");
  });

  eighties.forEach(d => {
    let div = document.createElement("div");
    others.appendChild(div);
    div.classList.add("eight");
  });

  nineties.forEach(d => {
    let div = document.createElement("div");
    others.appendChild(div);
    div.classList.add("nine");
  });

  twenty.forEach(d => {
    let div = document.createElement("div");
    others.appendChild(div);
    div.classList.add("twenty");
  });

  twentyTen.forEach(d => {
    let div = document.createElement("div");
    others.appendChild(div);
    div.classList.add("twentyTen");
  });
};