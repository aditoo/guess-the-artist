var guessCounter = 1;
var roundNumber = 1;
var score = 0;
const artistsList = ["jack johnson", "queen", "beatles", "rihanna", "sia", "britney spears", "justin timberlake", "chainsmokers", "imagine dragons", "ed sheeran"];
const roundNumberPlace = document.getElementById("round-number");
const pointsForRoundPlace = document.getElementById("point-for-round");
const totalScorePlace = document.getElementById("score-counter");
const guessText = document.getElementById("guess-box");
const firstGuess = document.getElementById("first-guess-name");
const secGuess = document.getElementById("sec-guess-name");
const thirdGuess = document.getElementById("third-guess-name");
const artwork = document.getElementById("artwork");
const startButton = document.getElementById("start-game");
const subButton = document.getElementById("guess");
const drawnArtists = drawArtists();

function load(){
  var roundNumberText = document.createTextNode("Round " + roundNumber);
  var pointsForRoundText = document.createTextNode("For 5 points");
  var totalScoreText = document.createTextNode("0");
  roundNumberPlace.appendChild(roundNumberText);
  pointsForRoundPlace.appendChild(pointsForRoundText);
  totalScorePlace.appendChild(totalScoreText);
  subButton.disabled = true;
}

function drawAlbums(numOfAlbums) {
  var arr = []
  while(arr.length < 3){
    var randomnumber = Math.ceil(Math.random() * numOfAlbums);
    if(arr.indexOf(randomnumber) > -1) continue;
    arr[arr.length] = randomnumber;
  }
  return arr;
}

function drawArtists() {
  var arr = []
  while(arr.length < 5){
    var randomnumber = Math.ceil(Math.random() * 10);
    if(arr.indexOf(randomnumber) > -1) continue;
    arr[arr.length] = randomnumber;
  }
  return arr;
}
function resetRound(){
  guessCounter = 1;
  roundNumber++;
  roundNumberPlace.childNodes[0].nodeValue = "Round " + roundNumber;
  pointsForRoundPlace.childNodes[0].nodeValue = "For 5 points";
  totalScorePlace.childNodes[0].nodeValue = score;
  firstGuess.style.display = 'none';
  secGuess.style.display = 'none';
  thirdGuess.style.display = 'none';
  guessText.value = '';
  artwork.style.display = 'none';
  subButton.disabled = true;
  if(roundNumber == 6){
    alert("Game Over. Your Total Score is: " + score);
  }
  else{
    startButton.disabled = false;
  }
}
startButton.onclick = function myFunction() {
  const getArtistID = new XMLHttpRequest();
  var currentArtist = artistsList[drawnArtists[roundNumber - 1] -1];
  console.log(currentArtist);
  const url = "https://itunes.apple.com/search?media=music&entity=musicArtist&term=";
  if(currentArtist.indexOf(" ") == -1){
    getArtistID.open("GET", url.concat(currentArtist), false);
    console.log(url.concat(currentArtist));
  }
  else{
    getArtistID.open("GET", url.concat(currentArtist.replace(" ", "+")), false);
    console.log(url.concat(currentArtist.replace(" ", "+")));
  }
  getArtistID.send();
  var artistID = JSON.parse(getArtistID.response).results[0].artistId;
  console.log(artistID);
  const getAlbums = new XMLHttpRequest();
  const albumsURL = "https://itunes.apple.com/lookup?entity=album&id=";
  getAlbums.open("GET", albumsURL.concat(artistID), false);
  console.log(albumsURL.concat(artistID));
  getAlbums.send();
  var records = JSON.parse(getAlbums.response).results;
  var numOfAlbums = JSON.parse(getAlbums.response).resultCount - 1;
  var drawnAlbums = drawAlbums(numOfAlbums);
  var firstAlbumName = document.createTextNode(records[drawnAlbums[0]].collectionName);
  firstGuess.appendChild(firstAlbumName);
  var secAlbumName = document.createTextNode(records[drawnAlbums[1]].collectionName);
  secGuess.appendChild(secAlbumName);
  var thirdAlbumName = document.createTextNode(records[drawnAlbums[2]].collectionName);
  thirdGuess.appendChild(thirdAlbumName);
  artwork.src = records[drawnAlbums[2]].artworkUrl100;
  firstGuess.style.display = 'block';
  startButton.disabled = true;
  startButton.childNodes[0].nodeValue = "Next Round"
  subButton.disabled = false;
}

subButton.onclick = function myFunction() {
  var currentArtist = artistsList[drawnArtists[roundNumber - 1] -1];
  if(guessText.value.toLowerCase() === currentArtist.toLowerCase()){
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
    resetRound();
    //document.getElementById("correct").style.visibility = "visible";
    //setTimeout(function(){document.getElementById("correct").style.visibility = "hidden";},2000);
  }
  else{
    guessText.value = '';
    guessCounter++;
  }

  if(guessCounter == 2){
    secGuess.style.display = 'block';
    pointsForRoundPlace.childNodes[0].nodeValue = "For 3 points";
  }
  if(guessCounter == 3){
    thirdGuess.style.display = 'block';
    pointsForRoundPlace.childNodes[0].nodeValue = "For 1 point";
    artwork.style.display ='inline';
  }
  if(guessCounter == 4){
    resetRound();
  }
}
