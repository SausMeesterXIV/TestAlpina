import { saveToStorage } from "../data-connector/local-storage-abstractor.js";
import { renderHand } from "../renderers/hand-renderer.js";
import { remainingHikers } from "../renderers/hiker-renderer.js";
import * as storageHandler from "../storage/storage-utils.js";

let playersList = [];
let spectatorIndex = 0;
let currentWatchingHiker = null;

function isSpectator() {
    return !storageHandler.getHiker(); // If a player doesn't have a colour saved in storage, that means they're spectator.
}

function initSpectatorMode(initialPlayers) {
    playersList = initialPlayers;

    document.querySelector("#spectator-area").classList.remove("hidden");
    document.querySelector("#player-controls").classList.add("hidden");

    updateSpectatorUI();
}

function switchPlayer(direction) {
    if (playersList.length === 0) return;

    spectatorIndex = (spectatorIndex + direction + playersList.length) % playersList.length;

    updateSpectatorToken();
    updateSpectatorUI();
}

function updatePlayers(newPlayersList) {
    const isFirstLoad = playersList.length === 0;
    playersList = newPlayersList;

    if (isFirstLoad) {
        const currToken = storageHandler.getPlayerToken();
        const currPlayerName = currToken.split("_")[1]; // extracts playerName from the playerToken

        spectatorIndex = playersList.findIndex(p => p.name === currPlayerName);
        if (spectatorIndex === -1) spectatorIndex = 0;

        updateSpectatorToken();
    }

    updateSpectatorUI();
}

function updateSpectatorToken() {
    const currPlayer = playersList[spectatorIndex];
    const gameId = Number(storageHandler.getGameId());

    const playerToken = `${gameId}_${currPlayer.name}`;

    saveToStorage("playerToken", playerToken);

    currentWatchingHiker = currPlayer.hiker;

    renderHand();
    remainingHikers();
}

function updateSpectatorUI() {
    const $nameDisplay = document.querySelector("#current-viewing-name");
    if (playersList[spectatorIndex]) $nameDisplay.textContent = playersList[spectatorIndex].name;
}

function getSpectatedHiker() {
    return currentWatchingHiker;
}

export {
    isSpectator,
    initSpectatorMode,
    switchPlayer,
    updatePlayers,
    getSpectatedHiker
}