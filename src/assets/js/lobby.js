import { fetchPlayerInfo } from "./api/player-info.js";
import { fetchSpecificGame } from "./api/game-info.js";
import { loadFromStorage } from "./data-connector/local-storage-abstractor.js";

function init() {
   checkGameStatus();
   renderPlayerInfo();
}

function getGameId() {
    return Number(loadFromStorage("gameId")); // Number() changes the returned value into an actual int instead of a String.
}

function checkGameStatus() {
  fetchSpecificGame(getGameId()).then(game => {
    renderPlayers(game.players);

    if (game.players.length === game.numberOfPlayers) {
      globalThis.location.replace("game.html");
    } else {
      const time = 2000;
      setTimeout(checkGameStatus, time);
    }
  });
}

function renderPlayers(players) {
    const $container = document.querySelector("#player-names");
    const playerHTML = players.map(player => { // changes every player object in the array into <h2>${player.name}</h2>
            return `<h2>${player.name}</h2>`;
          }).join(""); // .join() "glues" the items in an array together and seperates each value with the given value
    $container.innerHTML = "";
    $container.insertAdjacentHTML("beforeend", playerHTML);
}

function getHiker(){
  return loadFromStorage("hiker");
}

function renderPlayerInfo(){
  const gameId = Number(loadFromStorage("gameId"));
  const hiker = getHiker();

  fetchPlayerInfo(gameId)
    .then(players => players.find(player => player.hiker === hiker))
    .then(player => {
      loadPlayerName(player.name);
      selectPlayerColor(player.hiker);
    });
}

function loadPlayerName(name){ // loads the player's name into the input field
  const $playerNameInput = document.querySelector("#nickname-input");
  $playerNameInput.value = name;
}

function selectPlayerColor(hiker){ // marks the correct radio button for the player's hiker colour
  const selectedColor = `#${hiker}-radio`;
  const $selectedRadioButton = document.querySelector(`${selectedColor}`);
  $selectedRadioButton.checked = true;
}

init();