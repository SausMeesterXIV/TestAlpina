import {fetchSpecificGame} from "./game-info.js";
import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";
import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";
import {getGameId, getHiker} from "../storage-utils.js";


function fetchPlayerInfo(gameId) {
  return fetchSpecificGame(gameId)
    .then(game => {
       return game.players;
    });
}

function fetchPlayerHand() {
  return fetchFromServer(`/games/${getGameId()}/hikers/${getHiker()}/hand`).then(data => {return data.hand});
}

export {fetchPlayerInfo, fetchPlayerHand};

