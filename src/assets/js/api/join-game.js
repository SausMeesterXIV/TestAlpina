import {defaultPlayerName, defaultPlayerColor} from "../calculate-default-player-values.js";
import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";

function joinGame(gameId){
  return defaultPlayerName(gameId)
    .then(name =>{
      return name;
    })
    .then(name => defaultPlayerColor(gameId)
      .then(color => {
        const url = `/games/${gameId}/hikers/${color}`
        return {name, url};
    }))
    .then(data =>{
      const url = data.url;
      return fetchFromServer(url,"POST", { playerName: data.name })
    });
}

export {joinGame};