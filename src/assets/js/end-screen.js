import { loadFromStorage } from "./data-connector/local-storage-abstractor.js"

function init() {
    setBackground();
}

function getPlayerToken() {
    return loadFromStorage("playerToken");
}

function getGameId() {
    return loadFromStorage("gameId");
}

function setBackground() {

}

init();