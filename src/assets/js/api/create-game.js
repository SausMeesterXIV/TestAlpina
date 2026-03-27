import { fetchFromServer } from "../data-connector/api-communication-abstractor.js";

const _HOSTNAME = "player1"; // remove later
const _HOSTCOLOR = "purple"; // remove later

function createGame(nameOfGame, playerAmount) { // add hostName and hostColor once _HOSTNAME and _HOSTCOLOR have been removed
    const body = {
        gameName : nameOfGame,
        numberOfPlayers : playerAmount,
        playerName : _HOSTNAME,
        hiker : _HOSTCOLOR
    };
    return fetchFromServer("/games", "POST", body); // returns the playertoken
}

export { createGame };