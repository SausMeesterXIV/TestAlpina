import { fetchPlayerInfo } from "./api/player-info.js";
import { loadFromStorage } from "./data-connector/local-storage-abstractor.js";

function init() {
    loadPlayers();
}

function getGameId() {
    return Number(loadFromStorage("gameId")); // Number() changes the returned value into an actual int instead of a String.
}

function getPlayerNames() {
    const names = [];
    fetchPlayerInfo(getGameId())
        .then(players => players.forEach(player => {
            names.push(player.name);
        }));
    return names;
}

function renderPlayers() {
    
}

init();
getPlayerNames();