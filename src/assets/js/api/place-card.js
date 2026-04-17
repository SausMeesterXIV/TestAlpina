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

function addCardToBoardWithHiker(card, relativeCard, direction, hiker = card){
  const gameId = getGameId();
  const body = {
    hiker: getHiker(),
    cardPlacement:{
      card: Number(card),
      relativeTo: Number(relativeCard),
      direction: direction
    },
    hikerPlacement: Number(hiker)
  };
  return fetchFromServer(`/games/${gameId}/board`,"POST", body);
}

export {
  addCardToBoard,
  addCardToBoardWithHiker
};