import { fetchGameDetails } from "./api/game-info.js";
import { loadFromStorage } from "./data-connector/local-storage-abstractor.js";
import { renderLeaderboard as leaderboardRenderer } from "./leaderboard-renderer.js";

function init() {
    setBackground();
    renderLeaderboard();
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
    // TODO: Edge-case: if 2 players have the same amount of points, the last one in turn-order wins.
}

function hasMostPoints(players) {
    return getPlayerName() === calcBestPlayer(players).name;
}

function setBackground() {
    const $body = document.querySelector("body");
    fetchGameDetails(getGameId())
        .then(data => hasMostPoints(data.players) ? $body.classList.add("victory") : $body.classList.add("defeat")); // typical if-else structure, but simplified notation
}

function renderLeaderboard() {
  const $target = document.querySelector("tbody");
  fetchGameDetails(getGameId()).then(resp => leaderboardRenderer(resp.players, $target, false)); // false prevents the function from trying to load the amount of hikers
}

init();