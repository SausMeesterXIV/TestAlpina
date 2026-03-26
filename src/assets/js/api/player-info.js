  import {fetchSpecificGame} from "./game-info.js";

  function fetchPlayerInfo(gameId) {
    return fetchSpecificGame(gameId)
      .then(game => {
          return game.players;
      });
  }

  function savePlayersToLocalStorage(gameId) {
    fetchPlayerInfo(gameId)
      .then(players => {
        localStorage.setItem(`players_${gameId}`, JSON.stringify(players));
      })
      .catch(error => {
        console.error("Error fetching player info:", error);
      }
    );
  }


  export {fetchPlayerInfo, savePlayersToLocalStorage};