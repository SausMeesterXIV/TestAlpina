import {fetchPlayerInfo} from "./api/player-info.js"

function defaultPlayerName(gameId){
  let playername = `player`;

  fetchPlayerInfo(gameId).then(players => playername += players.length).then(name => {console.log(name)});
}

function defaulfPlayerHiker(gamId){

}

defaultPlayerName(1);