import { fetchGameDetails } from "./api/game-info.js";
import { renderLeaderboard as leaderboardRenderer } from "./leaderboard-renderer.js";
import * as storageHandler from "./storage-utils.js";

function init() {
    setBackground();
    renderLeaderboard();
}

function calcBestPlayer(players) {
    return players.reduce((currentBest, player) => { // iterates over the array until only the player with the best score remains
        if (player.score >= currentBest.score) {
            return player;
        }
        return currentBest;
    })
}

function hasMostPoints(players) {
    return storageHandler.getHiker() === calcBestPlayer(players).hiker;
}

function setBackground() {
    const $body = document.querySelector("body");
    fetchGameDetails(Number(storageHandler.getGameId()))
        .then(data => hasMostPoints(data.players) ? $body.classList.add("victory") : $body.classList.add("defeat")); // typical if-else structure, but simplified notation
}

function renderLeaderboard() {
  const $target = document.querySelector("tbody");
  fetchGameDetails(Number(storageHandler.getGameId())).then(resp => leaderboardRenderer(resp.players, $target, false)); // false prevents the function from trying to load the amount of hikers
}

init();