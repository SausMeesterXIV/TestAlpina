import { fetchPlayerInfo } from "./api/player-info.js";
import { loadFromStorage } from "./data-connector/local-storage-abstractor.js";

function init() {
   renderPlayers();
   renderPlayerInfo();
}

function getGameId() {
    return Number(loadFromStorage("gameId")); // Number() changes the returned value into an actual int instead of a String.
}

function renderPlayers() {
    const $container = document.querySelector("#player-names");
    fetchPlayerInfo(getGameId())
        .then(players => players.forEach(player => {
            $container.insertAdjacentHTML("beforeend", `<h2>${player.name}</h2>`)
        }));
}

// olivier delete when you are ready
function getPlayerName(){
  return loadFromStorage("playerName");
}

function renderPlayerInfo(){
  const gameId = Number(loadFromStorage("gameId"));
  const playerName = getPlayerName();
  console.log(playerName)

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
  const selectedColor = `#${hiker}-radio`
  const $selectedRadioButton = document.querySelector(`${selectedColor}`);
  $selectedRadioButton.checked = true;
}

init();