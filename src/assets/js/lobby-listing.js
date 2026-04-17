import { fetchStartedGames, fetchUnstartedGames } from "./api/game-info.js";
import {joinGame as fetchJoinGame} from "./api/join-game.js";
import {saveToStorage} from "./data-connector/local-storage-abstractor.js";

let currentTab = "unstarted"; // Keeps track which tab is currently selected.
let renderTimer = null; // Keeps track of the current timer ID to prevent overlapping timers (see line 73 for more information)

function init () {
    renderGameList();
    addEventListeners();
    //$expeditions.addEventListener('click', spectate);
}

function addEventListeners() {
    const $expeditions = document.querySelector('#expeditions');
    $expeditions.addEventListener('click', joinOrSpectateGame, true);

    const $createGameBtn = document.querySelector("#new-expedition-button");
    $createGameBtn.addEventListener("click", redirectToCreationPage);

    const $tabs = document.querySelectorAll('.tab');
    $tabs.forEach(tab => {
        tab.addEventListener('click', switchTab);
    });
}

function switchTab(e) {
    const clickedTab = e.target;
    
    // Update active tab styling
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    clickedTab.classList.add('active');

    currentTab = clickedTab.dataset.tab;

    renderGameList();
}

function createGameElement(game, hasStarted) {
    const $template = document.querySelector("#expedition-template");
    const $clone = document.importNode($template.content, true);

    $clone.querySelector(".comment").textContent = `ID: ${game.gameId}`;
    $clone.querySelector("h2").textContent = game.gameName;
    $clone.querySelector("h2+p").textContent = `${game.players.length}/${game.numberOfPlayers} players`;

    const $joinBtn = $clone.querySelector('input[value="join"]');
    $joinBtn.dataset.id = `${game.gameId}`;

    const $specBtn = $clone.querySelector('input[value="spectate"]');
    $specBtn.dataset.id = `${game.gameId}`;
    $specBtn.dataset.firstPlayer = game.players[0].name; // needed to be able to make the initial playerToken

    hasStarted ? $joinBtn.remove() : $specBtn.remove(); // Prevents players from joining games that are already going on.

    return $clone;
}

function renderGames(games, hasStarted) {
    const $target = document.querySelector("#expeditions");

    const $fragment = document.createDocumentFragment();

    games.forEach(game => {
        $fragment.appendChild(createGameElement(game, hasStarted));
    });

    $target.replaceChildren($fragment);
}

function renderGameList() {
  if (renderTimer) clearTimeout(renderTimer); 
  // Checks if there currently is a timer going on, if there is it will remove said timer. This prevents a bug where both init() and switchTab() try to fetch both the started and unstarted games, causing the page to flicker between the two tabs.

  if (currentTab === "unstarted") fetchUnstartedGames().then(games => renderGames(games, false));
  else if (currentTab === "started") fetchStartedGames().then(games => renderGames(games, true));
    renderTimer = setTimeout(renderGameList, 2000); // creates a new document fragment, appends each game to it, and then replaces the old games once the fragment is ready to overwrite them: this avoids flickering
}

function joinOrSpectateGame(e){
  e.preventDefault();

  const gameId = e.target.dataset.id;

  if (isJoinOrSpectate(e.target)){
    if (e.target.value === "spectate"){
      const firstPlayer = e.target.dataset.firstPlayer;
      spectateGame(gameId, firstPlayer);
    }else if (e.target.value === "join"){
      joinGame(gameId);
    }
  }
}

function isJoinOrSpectate(e){
  return e.value === "join" || e.value === "spectate";
}

function joinGame(gameId) {
  // set group into localstorage.
  saveToStorage("gameId", gameId);

  fetchJoinGame(Number(gameId)).then((data) => {
    // save users info to local storage upon joining
    saveToStorage("hiker", data.hiker);
    saveToStorage("playerToken", data.playerToken);
    // redirect page to lobby.
    window.location.replace("lobby.html");
  });

}

function spectateGame(gameId, playerName) {
  localStorage.clear(); // Removes previous hiker and playerToken to avoid potential issues. This needs to be removed and placed elsewhere at some point.
  saveToStorage("gameId", gameId);

  const initToken = `${gameId}_${playerName}`;
  saveToStorage("playerToken", initToken);

  window.location.replace("game.html");
}

function redirectToCreationPage() {
  window.location.replace("lobby-creation.html");
}

init();