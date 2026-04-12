import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";
import {getGameId, getHiker} from "../storage/storage-utils.js";

function addCardToBoard(card, relativeCard, direction){
  const gameId = getGameId();
  const body = {
    hiker: getHiker(),
    cardPlacement:{
      card: Number(card),
      relativeTo: Number(relativeCard),
      direction: direction
    }
  };
  return fetchFromServer(`/games/${gameId}/board`,"POST", body);
}

function addCardToBoardWithHikerInHand(card, relativeCard, direction){
  const gameId = getGameId();
  const body = {
    hiker: getHiker(),
    cardPlacement:{
      card: Number(card),
      relativeTo: Number(relativeCard),
      direction: direction
    },
    hikerPlacement: Number(card)
  };
  return fetchFromServer(`/games/${gameId}/board`,"POST", body);
}

export {
  addCardToBoard,
  addCardToBoardWithHikerInHand
}