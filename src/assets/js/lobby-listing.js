import { fetchUnstartedGames } from "./api/game-info.js";

function init () {
    renderGameList();
}

function createGameElement(game) {
    const $template = document.querySelector("#expedition-template");
    const $clone = document.importNode($template.content, true);

    $clone.querySelector(".comment").textContent = `ID: ${game.gameId}`;
    $clone.querySelector("h2").textContent = game.gameName;
    $clone.querySelector("h2+p").textContent = `${game.players.length}/${game.numberOfPlayers} players`;

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

init();