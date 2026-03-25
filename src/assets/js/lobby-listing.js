import { fetchFromServer } from "./data-connector/api-communication-abstractor.js";

function init () {
    renderGameList();
}

function renderGameList() {
    const $template = document.querySelector("#expedition-template");
    fetchFromServer("/games?started=false")
        .then(resp => {
            resp.games.forEach(game => {
                const $clone = document.importNode($template.content, true);
                $clone.querySelector(".comment").textContent = `ID: ${game.gameId}`;
                $clone.querySelector("h2").textContent = game.gameName;
                $clone.querySelector("h2+p").textContent = `${game.players.length}/${game.numberOfPlayers} players`;

                document.querySelector("#expeditions").appendChild($clone);
            })
        });
}

init();