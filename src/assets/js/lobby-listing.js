import { fetchUnstartedGames } from "./api/game-info.js";
import {saveToStorage} from "./data-connector/local-storage-abstractor.js";

function init () {
    renderGameList();

    const $expeditions = document.querySelector('#expeditions');
    $expeditions.addEventListener('click', joinOrSpectateGame, true);
    //$expeditions.addEventListener('click', spectate);
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
    games.forEach(game => {
        $target.appendChild(createGameElement(game));
    })
}

function renderGameList() {
    fetchUnstartedGames().then(renderGames);
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

function joinGame(gameId){
  // set group into localstorage.
  saveToStorage("gameId", gameId);
  // redirect page to lobby.
  window.location.replace("http://localhost:63342/client/src/lobby.html");
}

init();