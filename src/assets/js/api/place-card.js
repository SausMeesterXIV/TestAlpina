import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";
import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";

function addCardToBoard(card, relativeCard, direction){
  const gameId = loadFromStorage("gameId");
  const body = {
    hiker: loadFromStorage("hiker"),
    cardPlacement:{
      // hard coded card should be the card that is played by the player
      card: Number(card),
      // hard coded should be the card that is next to the card that you play in the grid.
      relativeTo: relativeCard,
      direction: direction
    }
  };

  console.log(body);
  return fetchFromServer(`/games/${gameId}/board`,"POST", body);
}

export {addCardToBoard}