import * as CommunicationAbstractor from "./data-connector/api-communication-abstractor.js";
import {fetchFromServer} from "./data-connector/api-communication-abstractor.js";

function init(){
 getSpecificGameInfo(1).then(r => console.log(r));
}

function getGames(){
  return fetchFromServer("/games")
    .then(data => {
      return data.games;
    });
}

function getSpecificGameInfo(gameId){
  return getGames().then(games => {
    return games.forEach(game => {
      if(game.gameId === gameId){
        return console.log(game.gameId);
      }
    })
  })
}

function getPlayyerInfo(){

}

init();