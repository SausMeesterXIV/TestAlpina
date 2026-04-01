import { fetchPlayerInfo } from "./api/player-info.js";
import { fetchSpecificGame } from "./api/game-info.js";
import { loadFromStorage } from "./data-connector/local-storage-abstractor.js";

function init() {
   renderPlayers();
   renderPlayerInfo();
   redirectToGame();
}

function getGameId() {
    return Number(loadFromStorage("gameId")); // Number() changes the returned value into an actual int instead of a String.
}

function renderPlayers() {
    const $container = document.querySelector("#player-names");
    fetchPlayerInfo(getGameId())
        .then(players => { 
          const playerHTML = players.map(player => { // changes every player object in the array into <h2>${player.name}</h2>
            return `<h2>${player.name}</h2>`
          }).join(""); // .join() "glues" the items in an array together and seperates each value with the given value
          $container.innerHTML = "";
          $container.insertAdjacentHTML("beforeend", playerHTML);
        });
    setTimeout(renderPlayers, 2000);
}

// olivier delete when you are ready
function getPlayerName(){
  return loadFromStorage("playerName");
}

function renderPlayerInfo(){
  const gameId = Number(loadFromStorage("gameId"));
  const playerName = getPlayerName();

  fetchPlayerInfo(gameId)
    .then(players => players.find(player => player.name === playerName))
    .then(player => {
      loadPlayerName(player.name);
      selectPlayerColor(player.hiker);
    });
}

function loadPlayerName(name){
  const $playerNameInput = document.querySelector("#nickname-input");
  $playerNameInput.value = name;
}

function selectPlayerColor(hiker){
  const selectedColor = `#${hiker}-radio`;
  const $selectedRadioButton = document.querySelector(`${selectedColor}`);
  $selectedRadioButton.checked = true;
}

function redirectToGame() {
  fetchSpecificGame(getGameId()).then(game => {
    game.players.length === game.numberOfPlayers ? window.location.replace("game.html") : setTimeout(hasGameStarted, 2000);
  })
}

init();