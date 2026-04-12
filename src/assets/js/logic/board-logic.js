import {addCardToBoard, addCardToBoardWithHikerInHand} from "../api/place-card.js";
import {fetchGameDetails} from "../api/game-info.js";
import * as storageHandler from "../storage/storage-utils.js"
import * as variables from "../game.js";


let turn = null;

function hasHikerOnCardInHand(){
  const card = variables.selectedCard.querySelector(".hiker");
  // if there is no hiker, the player sends card without hiker to server
  return !card.classList.contains("hidden"); // CHANGE TO HIKER LATER!
}

function getMove(tileId, selectedTile, cardId) {
  return {
    tileId: tileId,
    tile: selectedTile,
    cardId: cardId
  };
}

function handleSelectedCardPlacement(cardId, tileId, selectedTile) {
  if (variables.selectedCard !== null) {
    if (Number(cardId) !== 0) {
      const move = getMove(tileId, selectedTile, cardId);
      placeCard(move);
    }
  }
}

function handleTileClick(e){
  const selectedTile = e.target.closest("div");
  const tileId = selectedTile.dataset.id;
  const cardId = selectedTile.dataset.cardId;

  handleSelectedCardPlacement(cardId, tileId, selectedTile);
}

function placeCard(move){
  console.log("Move geïnitieerd voor tile:", move.tile);
  getClosestCard(move.tile).then(closest => {
    if (closest) {
      if (hasHikerOnCardInHand()){
        variables.hasPlacedHiker = true;
        createTurn(variables.selectedCard.dataset.cardId, closest.card, closest.direction);
        // TODO: check where the hiker is placed on the grid not only in the hand.
      }else{
        createTurn(variables.selectedCard.dataset.cardId, closest.card, closest.direction);
      }
    }
  });
}

function createTurn(cardId, closestCardId, direction){
  turn = {
    cardId,
    closestCardId,
    direction
  }
}

function safe(row,column,currentBoard, size){
  const inBounds = row >= 0 && column >= 0 && row < size && column < size;

  if (currentBoard?.[row]?.[column] === undefined) {
    return null;
  }else{
    const hasCard = Number(currentBoard[row][column].card) === 0;

    if(inBounds && !hasCard){
      const card = Number(currentBoard[row][column].card);
      // returns null when there is no card
      return card !== 0 ? card : null;
    }
  }
}

function getClosestCard(tile){
  // tile position based on 1 array value (0-24)
  const tilePos = tile.dataset.index;
  // size of the grid (5x5)
  const boardSize = 5;

  return fetchGameDetails(Number(storageHandler.getGameId())).then(game=>{
    const currentBoard = game.board;
    // tile position based on 2D Array
    const tilePosRow = Math.floor(tilePos / boardSize);
    const tilePosColumn = tilePos % boardSize;
    //SAFE: Checks whether a given (row, column) is inside the board
    //and if it contains a non‑zero card.
    const up = safe(tilePosRow + 1, tilePosColumn, currentBoard, boardSize);
    const right = safe(tilePosRow, tilePosColumn - 1, currentBoard, boardSize);
    const down = safe(tilePosRow - 1, tilePosColumn, currentBoard, boardSize);
    const left = safe(tilePosRow, tilePosColumn + 1, currentBoard, boardSize);


    if (up) return { direction: "north", card : up };
    if (right) return { direction: "east", card: right };
    if (down) return { direction: "south", card: down };
    if (left) return { direction: "west", card: left };

    return null;
  });
}

function endTurnButton(){
  if (turn !== null){
    if (variables.hasPlacedHiker){
      // fetch with hiker
      addCardToBoardWithHikerInHand(variables.selectedCard.dataset.cardId, turn.closestCardId, turn.direction)
        .then(() =>{
          // TODO: clear hasplacedhiker and the selectedcard.
        });
    }else {
      // fetch without hiker
      addCardToBoard(variables.selectedCard.dataset.cardId, turn.closestCardId, turn.direction)
        .then(() =>{
          // TODO: clear hasplacedhiker and the selectedcard.
        });
    }
  }
}

export {
  handleTileClick,
  endTurnButton
}