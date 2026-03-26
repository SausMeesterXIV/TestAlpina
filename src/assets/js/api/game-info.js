import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";

function fetchAllGames() {
  return fetchFromServer("/games")
    .then(data => {
        return data.games;
    });
}

function fetchSpecificGame(gameId) {
  return fetchAllGames().then(games => {
    if (games.length > 0){
      return games.find(game => game.gameId === gameId);
    }
    // return object because in games there are object (game)
    return {};
  });
}

function fetchUnstartedGames() {
    return fetchFromServer("/games?started=false")
        .then(resp => resp.games);
}

function fetchGameDetails(gameId) {
  return fetchFromServer(`/games/${gameId()}`);
} 

export{
  fetchSpecificGame,
  fetchUnstartedGames,
  fetchGameDetails
};