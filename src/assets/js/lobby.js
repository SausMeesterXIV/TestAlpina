import { loadFromStorage } from "./data-connector/local-storage-abstractor.js";

function init() {
    loadPlayers();
}

function getGameId() {
    return loadFromStorage("gameId");
}

function getPlayerNames() {

}

function loadPlayers() {
    const playerNames = getPlayerNames();
}

init();