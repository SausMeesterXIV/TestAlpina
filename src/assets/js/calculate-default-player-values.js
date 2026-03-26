import {fetchPlayerInfo} from "./api/player-info.js"

function defaultPlayerName(gameId){
  let playername = `player`;

  fetchPlayerInfo(gameId).then(players => {
    return playername + players.length;
  });
}