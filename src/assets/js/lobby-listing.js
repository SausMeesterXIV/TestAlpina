import { fetchUnstartedGames } from "./api/game-info.js";
import {joinGame as fetchJoinGame} from "./api/join-game.js";
import {saveToStorage} from "./data-connector/local-storage-abstractor.js";
import {getGameId} from "./storage-utils.js";

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
}

function createGameElement(game) {
    const $template = document.querySelector("#expedition-template");
    const $clone = document.importNode($template.content, true);

    $clone.querySelector(".comment").textContent = `ID: ${game.gameId}`;
    $clone.querySelector("h2").textContent = game.gameName;
    $clone.querySelector("h2+p").textContent = `${game.players.length}/${game.numberOfPlayers} players`;
    $clone.querySelector('input[value="spectate"]').dataset.id = `${game.gameId}`;
    $clone.querySelector('input[value="join"]').dataset.id = `${game.gameId}`;

    return $clone;
}

function renderGames(games) {
    const $target = document.querySelector("#expeditions");

    const fragment = document.createDocumentFragment();

    games.forEach(game => {
        fragment.appendChild(createGameElement(game));
    })

    $target.replaceChildren(fragment);
}

function renderGameList() {
    fetchUnstartedGames().then(renderGames);
    setTimeout(renderGameList, 2000); // creates a new document fragment, appends each game to it, and then replaces the old games once the fragment is ready to overwrite them: this avoids flickering
}

function joinOrSpectateGame(e){
  e.preventDefault();

  const gameId = e.target.dataset.id;

  if (isJoinOrSpectate(e.target)){
    if (e.target.value === "spectate"){
      return null;
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

function redirectToCreationPage() {
  window.location.replace("lobby-creation.html");
}

init();