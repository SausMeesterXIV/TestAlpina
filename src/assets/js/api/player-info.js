import {fetchSpecificGame} from "./game-info.js";
import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";
import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";
import {getGameId, getHiker} from "../storage-utils.js";

<<<<<<< HEAD
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
=======
  function fetchPlayerInfo(gameId) {
    return fetchSpecificGame(gameId)
      .then(game => {
          return game.players;
      });
  }

  export {fetchPlayerInfo};
>>>>>>> 9af7eb70d4b79be57bf9c018cfbe5eeb84d07ea4
