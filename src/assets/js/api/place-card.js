import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";
import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";

function addCardToBoard(card, relativeCard, direction){
  const gameId = loadFromStorage("gameId");
  const body = {
    hiker: loadFromStorage("hiker"),
    cardPlacement:{
      card: Number(card),
      relativeTo: relativeCard,
      direction: direction
    }
  };

  console.log(body);
  return fetchFromServer(`/games/${gameId}/board`,"POST", body);
}

function addCardToBoardWithHikerInHand(card, relativeCard, direction){
  const gameId = loadFromStorage("gameId");
  const body = {
    hiker: loadFromStorage("hiker"),
    cardPlacement:{
      card: Number(card),
      relativeTo: relativeCard,
      direction: direction
    },
    hikerPlacement: Number(card)
  };
  console.log("can place with hiker");
  return fetchFromServer(`/games/${gameId}/board`,"POST", body);
}

export {
  addCardToBoard,
  addCardToBoardWithHikerInHand
}