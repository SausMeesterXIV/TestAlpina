import { fetchPlayerInfo } from "./api/player-info.js";
import { loadFromStorage } from "./data-connector/local-storage-abstractor.js";

function init() {
   renderPlayers();
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

init();