import {fetchGameDetails} from "../api/game-info.js";
import * as storageHandler from "../storage/storage-utils.js"

function remainingHikers() {
  const $button = document.querySelector("#select-hiker-button");
  const gameId = Number(storageHandler.getGameId());
  const currentPlayer ="purple"; //HARDCODED
  const text = document.querySelector("span");

  fetchGameDetails(gameId)
    .then(data => data.players)
    .then(players => {
      players.forEach(player => {
        if (player.hiker !== currentPlayer) {
          return;
        }
        const hikers = player.hikersLeft;
        text.textContent = hikers;
        $button.appendChild(text);
      })

    })
}

export {
  remainingHikers
};