import {fetchSpecificGame} from "./game-info.js";
import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";
import {getGameId, getHiker} from "../storage/storage-utils.js";
import { getSpectatedHiker, isSpectator } from "../logic/spectator-logic.js";


function fetchPlayerInfo(gameId) {
  return fetchSpecificGame(gameId)
    .then(game => {
       return game.players;
    });
}

function fetchPlayerHand() {
  const hikerColor = isSpectator() ? getSpectatedHiker() : getHiker();

  return fetchFromServer(`/games/${getGameId()}/hikers/${hikerColor}/hand`).then(data => {return data.hand});
}

export {fetchPlayerInfo, fetchPlayerHand};