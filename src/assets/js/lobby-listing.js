import { fetchFromServer } from "./data-connector/api-communication-abstractor.js";

function init () {
    renderGameList();
}

function fetchGames() {
    return fetchFromServer("/games?started=false")
        .then(resp => resp.games);
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
    fetchGames().then(renderGames)
}

init();