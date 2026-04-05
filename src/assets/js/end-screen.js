import { fetchGameDetails } from "./api/game-info.js";
import { renderLeaderboard as leaderboardRenderer } from "./leaderboard-renderer.js";
import * as storageHandler from "./storage-utils.js";

function init() {
    fetchGameDetails(Number(storageHandler.getGameId())).then(data => {
        setBackground(data.players);
        renderLeaderboard(data.players);
    })
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

function setBackground(players) {
    const $body = document.querySelector("body");
    hasMostPoints(players) ? $body.classList.add("victory") : $body.classList.add("defeat"); // typical if-else structure, but simplified notation
}

function renderLeaderboard(players) {
    const $target = document.querySelector("tbody");
    leaderboardRenderer(players, $target, false); // false prevents the function from trying to load the amount of hikers
}

init();