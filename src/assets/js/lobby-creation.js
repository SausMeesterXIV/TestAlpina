// Future note: add turn time and private functionality once we made the server

import { createGame } from "./api/create-game.js";
import { saveToStorage } from "./data-connector/local-storage-abstractor.js";

function init() {
    addEventListeners();
}

function addEventListeners() {
    document.querySelector("form").addEventListener("submit", createNewGame);
}

function getGameName() {
    return document.querySelector("#expedition-name").value;
}

function getPlayerAmount() {
    return Number(document.querySelector("input[name='amount-of-players']:checked").value); // Number() turns the string into an int
}

function createNewGame(e) {
    e.preventDefault();
    
    const gameName = getGameName();
    const playerAmount = getPlayerAmount();
    
    createGame(gameName, playerAmount).then(data => {
        saveToStorage("gameId", data.gameId);
        saveToStorage("playerToken", data.playerToken);
        saveToStorage("hiker", data.hiker);

        window.location.replace("lobby.html");
    });
}

init();