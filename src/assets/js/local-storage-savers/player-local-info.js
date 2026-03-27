import { fetchPlayerInfo } from "./player-info.js";
import { saveToStorage } from "./local-storage-abstractor.js";

function savePlayersToLocalStorage(gameId) {
  fetchPlayerInfo(gameId)
    .then(players => {
      saveToStorage("hiker", players.hiker);
      saveToStorage("name", players.name);
      saveToStorage("token", players.playerToken);
    })
}

  export {savePlayersToLocalStorage};