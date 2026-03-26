import {fetchPlayerInfo} from "./api/player-info.js";

function defaultPlayerName(gameId){
  let playerName = `player`;

  fetchPlayerInfo(gameId).then(players => {
    return playerName + players.length;
  });
}

function defaultPlayerColor(gameId) {
  const hikerColors = ["purple", "yellow", "red", "lightblue"];

  return fetchPlayerInfo(gameId)
    .then(players => {
      const usedHikers = players.map(player => player.hiker);
      return hikerColors.filter(color => !usedHikers.includes(color));
    })
    .then(hikers => {
      // selects the first hiker that is available.
      return hikers[0];
    });
}