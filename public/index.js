var guessCounter = 1;
var roundNumber = 1;
var score = 0;

const artistsList = ["jack johnson", "queen", "the beatles", "rihanna", "sia", "britney spears", "justin timberlake", "the chainsmokers", "imagine dragons", "ed sheeran", "bob marley", "jason mraz", "red hot chili peppers", "michael jackson", "3 doors down", "aerosmith", "radiohead", "pink floyd", "backstreet Boys", "madonna"];

const roundNumberPlace = document.getElementById("round-number");
const pointsForRoundPlace = document.getElementById("point-for-round");
const totalScorePlace = document.getElementById("score-counter");
const finalScorePlace = document.getElementById("final-score");
const guessText = document.getElementById("guess-box");
const firstGuess = document.getElementById("first-guess-name");
const secGuess = document.getElementById("sec-guess-name");
const thirdGuess = document.getElementById("third-guess-name");
const artwork = document.getElementById("artwork");
const startButton = document.getElementById("start-game");
const subButton = document.getElementById("guess");
const chosenArtists = randomArtists();
const message = document.getElementById("message");
const basicModal = document.getElementById("basicModal");
const restartButton = document.getElementById("restart-button");

// on page load - set all variable to first round settings.
function load() {
  var roundNumberText = document.createTextNode("Round " + roundNumber);
  var pointsForRoundText = document.createTextNode("For 5 points");
  var totalScoreText = document.createTextNode("0");
  var finalScoreText = document.createTextNode("0");
  roundNumberPlace.appendChild(roundNumberText);
  pointsForRoundPlace.appendChild(pointsForRoundText);
  totalScorePlace.appendChild(totalScoreText);
  finalScorePlace.appendChild(finalScoreText);
  subButton.disabled = true;
}

// restart button will reload and restart game.
restartButton.onclick = function() {
  window.location.reload();
}

// choose randomly 3 album indexes for artist with numOfAlbums albums (return in array).
function randomAlbums(numOfAlbums) {
  var arr = []
  while (arr.length < 3) {
    var randomnumber = Math.ceil(Math.random() * numOfAlbums);
    if (arr.indexOf(randomnumber) > -1) continue;
    arr[arr.length] = randomnumber;
  }
  return arr;
}

// choose randomly 5 artist indexes (return in array).
function randomArtists() {
  var arr = []
  while (arr.length < 5) {
    var randomnumber = Math.ceil(Math.random() * 20);
    if (arr.indexOf(randomnumber) > -1) continue;
    arr[arr.length] = randomnumber;
  }
  return arr;
}

// reset all variable to new round settings
function resetRound() {
  subButton.disabled = true;
  guessCounter = 1;
  roundNumber++;

  // if game is over - alert user
  if (roundNumber == 6) {
    finalScorePlace.childNodes[0].nodeValue = score;
    $("#basicModal").modal();
    guessCounter = 1;
    roundNumber = 1;
    score = 0;
  } else {
    startButton.disabled = false;
  }

  roundNumberPlace.childNodes[0].nodeValue = "Round " + roundNumber;
  pointsForRoundPlace.childNodes[0].nodeValue = "For 5 points";
  totalScorePlace.childNodes[0].nodeValue = score;
  firstGuess.style.display = 'none';
  secGuess.style.display = 'none';
  thirdGuess.style.display = 'none';
  firstGuess.removeChild(firstGuess.childNodes[0]);
  secGuess.removeChild(secGuess.childNodes[0]);
  thirdGuess.removeChild(thirdGuess.childNodes[0]);
  guessText.value = '';
  artwork.style.display = 'none';
  subButton.disabled = true;
}

// start button functionality.
startButton.onclick = function myFunction() {
  // get artist ID.
  const getArtistID = new XMLHttpRequest();
  var currentArtist = artistsList[chosenArtists[roundNumber - 1] - 1];
  const url = "https://itunes.apple.com/search?media=music&entity=musicArtist&term=";
  if (currentArtist.indexOf(" ") == -1) {
    getArtistID.open("GET", url.concat(currentArtist), false);
  } else {
    getArtistID.open("GET", url.concat(currentArtist.replace(" ", "+")), false);
  }
  getArtistID.send();
  var artistID = JSON.parse(getArtistID.response).results[0].artistId;
  // get albums list for specific artist
  const getAlbums = new XMLHttpRequest();
  const albumsURL = "https://itunes.apple.com/lookup?entity=album&id=";
  getAlbums.open("GET", albumsURL.concat(artistID), false);
  getAlbums.send();

  // set albums on screen (as hidden except the first one).
  var records = JSON.parse(getAlbums.response).results;
  var numOfAlbums = JSON.parse(getAlbums.response).resultCount - 1;
  var chosenAlbums = randomAlbums(numOfAlbums);
  var firstAlbumName = document.createTextNode(records[chosenAlbums[0]].collectionName);
  firstGuess.appendChild(firstAlbumName);
  var secAlbumName = document.createTextNode(records[chosenAlbums[1]].collectionName);
  secGuess.appendChild(secAlbumName);
  var thirdAlbumName = document.createTextNode(records[chosenAlbums[2]].collectionName);
  thirdGuess.appendChild(thirdAlbumName);
  artwork.src = records[chosenAlbums[2]].artworkUrl100;
  firstGuess.style.display = 'block';
  startButton.disabled = true;
  startButton.childNodes[0].nodeValue = "Next Round";
  subButton.disabled = false;
}

// submit button functionality.
subButton.onclick = function myFunction() {
  var currentArtist = artistsList[chosenArtists[roundNumber - 1] - 1];
  // compare on lowercase and add score according to the guess number.
  if (guessText.value.toLowerCase() === currentArtist.toLowerCase()) {
    switch (guessCounter) {
      case 1:
        score += 5;
        break;
      case 2:
        score += 3;
        break;
      case 3:
        score += 1;
    }
    // alert user on correct answer and reset round.
    resetRound();
    message.classList.add("alert-success");
    var correct = document.createTextNode("Correct!");
    message.appendChild(correct);
    message.style.visibility = "visible";
    setTimeout(function() {
      message.style.visibility = "hidden";
      message.classList.remove("alert-success");
      message.removeChild(message.childNodes[0]);
    }, 1000);
  } else {
    // alert user on wrong answer.
    guessText.value = '';
    guessCounter++;
    subButton.disabled = true;
    message.classList.add("alert-danger");
    var wrong = document.createTextNode("Wrong answer...");
    message.appendChild(wrong);
    message.style.visibility = "visible";
    setTimeout(function() {
      if(guessCounter != 1){
          subButton.disabled = false;
      }
      message.style.visibility = "hidden";
      message.classList.remove("alert-danger");
      message.removeChild(message.childNodes[0]);
    }, 1000);
  }

  if (guessCounter == 2) {
    secGuess.style.display = 'block';
    pointsForRoundPlace.childNodes[0].nodeValue = "For 3 points";
  }
  if (guessCounter == 3) {
    thirdGuess.style.display = 'block';
    pointsForRoundPlace.childNodes[0].nodeValue = "For 1 point";
    artwork.style.display = 'inline';
  }
  // if failed to guess - continue to next round with no additional points.
  if (guessCounter == 4) {
    resetRound();
  }
}
