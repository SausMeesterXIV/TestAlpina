import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";

function fetchAllGames() {
  return fetchFromServer("/games")
    .then(data => data.games);
}

function fetchSpecificGame(gameId) {
  return fetchAllGames().then(games => {
    return games.find(game => game.gameId === gameId);
  });
}

export{
  fetchSpecificGame
}