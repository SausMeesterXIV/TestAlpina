import { fetchPlayerInfo } from "./game-info.js";
import { saveToStorage } from "./local-storage-abstractor.js";

function savePlayersToLocalStorage(gameId) {
  fetchPlayerInfo(gameId)
    .then(players => {
      saveToStorage("gameId", gameId);
      saveToStorage("hikerColor", players.hiker);
      saveToStorage("playerToken", players.playerToken);
    })
}

  export {savePlayersToLocalStorage};