import {fetchSpecificGame} from "./game-info.js";

function fetchPlayerInfo(gameId) {
  return fetchSpecificGame(gameId)
    .then(game => game.players);
}

export {fetchPlayerInfo};