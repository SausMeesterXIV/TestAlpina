import * as config from "../config.js";
import * as storageHandler from "../storage/storage-utils.js";
import * as gameConfig from "../game-config.js";

import {addCardToBoard, addCardToBoardWithHiker} from "../api/place-card.js";
import {fetchGameDetails} from "../api/game-info.js";

import {flashError} from "../renderers/error-renderer.js";

function hasHikerOnCardInHand(){
  const card = gameConfig.selectedCard.querySelector(".hiker");
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

function handleSelectedCardPlacement(cardId, tileId, selectedTile, e) {
  if (gameConfig.selectedCard !== null) { // card that player wants to place
    if (Number(cardId) === 0) { // if tile is empty place card.
      const move = getMove(tileId, selectedTile, cardId);
      placeCard(move, e);
    }
  }
}

function handleTileClick(e){
  const selectedTile = e.target.closest("div");
  const tileId = selectedTile.dataset.index;
  const cardId = selectedTile.dataset.card;

  if (gameConfig.placingHiker){ // if player wants to place a hiker on a card
    // place hiker on board.
    handleHikerPlacePlacement(cardId);
  } else { // place card.
    handleSelectedCardPlacement(cardId, tileId, selectedTile, e);
  }
}

function handleHikerPlacePlacement(cardId){
  if (!gameConfig.hasPlacedHiker){
    gameConfig.setHikerPlacement(cardId);
    gameConfig.changePlacedHikerState();
    // TODO: make it so visualy there is placed a card.
  }
}

function placeCard(move, e){
  getClosestCard(move.tile).then(closest => {
    if (closest) {
      if (hasHikerOnCardInHand()){
        // hiker is placed on card in hand.
        gameConfig.changePlacedHikerState();
        createTurn(gameConfig.selectedCard.dataset.cardId, closest.card, closest.direction);
      } else if(gameConfig.selectedCard !== null){
        // hiker is placed on card on board so needs card id of other card.
        createTurnWithHiker(gameConfig.selectedCard.dataset.cardId, closest.card, closest.direction, config.hikerPlacement);
      }else {
        // no hiker selected so only card needed.
        createTurn(gameConfig.selectedCard.dataset.cardId, closest.card, closest.direction);
      }
    } else {
      flashError(e, "Cards must be placed next to existing ones.");
    }
  });
}

function createTurn(cardId, closestCardId, direction){
  gameConfig.setTurn({
    cardId,
    closestCardId,
    direction
  });
}

function createTurnWithHiker(cardId, closestCardId, direction, hiker){
  gameConfig.setTurn({
    cardId,
    closestCardId,
    direction,
    hiker
  });
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
  const boardSize = gameConfig.boardSize;

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
  if (gameConfig.turn !== null){
    if (gameConfig.hasPlacedHiker){
      if(gameConfig.turn.hiker !== undefined){
        addCardToBoardWithHiker(gameConfig.selectedCard.dataset.cardId, gameConfig.turn.closestCardId, gameConfig.turn.direction, gameConfig.turn.hiker).then(() =>{
          gameConfig.resetPlayerConfig();
        });
      }else {
        // fetch with hiker
        addCardToBoardWithHiker(gameConfig.selectedCard.dataset.cardId, gameConfig.turn.closestCardId, gameConfig.turn.direction)
          .then(() =>{
            gameConfig.resetPlayerConfig();
          });
      }
    }else {
      // fetch without hiker
      addCardToBoard(gameConfig.selectedCard.dataset.cardId, gameConfig.turn.closestCardId, gameConfig.turn.direction)
        .then(() =>{
          gameConfig.resetPlayerConfig();
        });
    }
  }
}

export {
  handleTileClick,
  endTurnButton,
  safe
};