import {fetchPlayerInfo} from "./api/player-info.js";

function defaultPlayerName(gameId){
  const playerName = `player`;

  return fetchPlayerInfo(gameId).then(players => {
    const number = players.length + 1;
    return playerName + number;
  });
}

function defaultPlayerColor(gameId) {
  const hikerColors = ["purple", "yellow", "red", "lightblue"];

  return fetchPlayerInfo(gameId)
    .then(players => {
      const usedHikers = new Set(players.map(p => p.hiker));
      return hikerColors.filter(color => !usedHikers.has(color)); // .has (Set) is more efficient than a .includes (Array) for bigger arrays
    })
    .then(hikers => {
      // selects the first hiker that is available.
      return hikers[0];
    });
}

export{
  defaultPlayerName,
  defaultPlayerColor
};