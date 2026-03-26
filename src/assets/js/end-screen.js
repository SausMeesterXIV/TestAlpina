import { fetchGameDetails } from "./api/game-info.js";
import { loadFromStorage } from "./data-connector/local-storage-abstractor.js"

function init() {
    setBackground();
}

function getPlayerName() {
    return loadFromStorage("playerName");
}

function getGameId() {
    return Number(loadFromStorage("gameId")); //Makes sure the gameId is returned as an int and not a String.
}

function calcBestPlayer(players) {
    return players.reduce((currentBest, player) => { // iterates over the array until only the player with the best score remains
        if (player.score > currentBest.score) {
            return player;
        }
        return currentBest;
    })
}

function hasMostPoints(players) {
    return getPlayerName() === calcBestPlayer(players).name;
}

function setBackground() {
    const $body = document.querySelector("body");
    fetchGameDetails(getGameId())
        .then(data => hasMostPoints(data.players) ? $body.classList.add("victory") : $body.classList.add("defeat")); // typical if-else structure, but simplified notation
}

init();