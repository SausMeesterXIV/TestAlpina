import * as config from "../config.js";
import * as storageHandler from "../storage/storage-utils.js";
import * as gameConfig from "../game-config.js";

import {addCardToBoard, addCardToBoardWithHiker} from "../api/place-card.js";
import {fetchGameDetails} from "../api/game-info.js";

import {flashError} from "../renderers/error-renderer.js";

function hasHikerOnCardInHand(){
  const card = gameConfig.getSelectedCard().querySelector(".hiker");
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
  if (gameConfig.getSelectedCard() !== null) { // card that player wants to place
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

  if (gameConfig.getPlacingHiker()){ // if player wants to place a hiker on a card
    // place hiker on board.
    handleHikerPlacePlacement(cardId);
  } else { // place card.
    handleSelectedCardPlacement(cardId, tileId, selectedTile, e);
  }
}

function handleHikerPlacePlacement(cardId){
  if (!gameConfig.getHasPlacedHiker()){
    gameConfig.setHikerPlacement(cardId);
    gameConfig.changePlacedHikerState();
    // future note: show that the player placed a card there
  }
}

function placeCard(move, e){
  getClosestCard(move.tile).then(closest => {
    if (!closest) {
       flashError(e, "Cards must be placed next to existing ones."); 
       return;
    }
    if (hasHikerOnCardInHand()){
      // hiker is placed on card in hand.
      gameConfig.changePlacedHikerState();
      createTurn(gameConfig.getSelectedCard().dataset.cardId, closest.card, closest.direction);
    } else if(gameConfig.getSelectedCard()){
      // hiker is placed on card on board so needs card id of other card.
      createTurnWithHiker(gameConfig.getSelectedCard().dataset.cardId, closest.card, closest.direction, config.hikerPlacement); // gameConfig.getHikerPlacement() causes a bug, config.hikerPlacement (which doesn't exist) works completely as intended
    } else {
      // no hiker selected so only card needed.
      createTurn(gameConfig.getSelectedCard().dataset.cardId, closest.card, closest.direction);
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
  if (!inBounds) return null;

  const cell = currentBoard?.[row]?.[column]; // ?.[row]?.[column] checks first if [row] isn't null or undefined, else it returns undefined immediately. Idem for [column]
  if (!cell) return null;
  
  const card = Number(cell.card);
  if (card === 0) return null;

  return card;
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
  if (gameConfig.getTurn() !== null){
    if (gameConfig.getHasPlacedHiker()){
      if(gameConfig.getTurn().hiker === undefined){
        addCardToBoardWithHiker(gameConfig.getSelectedCard().dataset.cardId, gameConfig.getTurn().closestCardId, gameConfig.getTurn().direction).then(() =>{
          gameConfig.resetPlayerConfig();
        });
      }else {
        // fetch with hiker
        addCardToBoardWithHiker(gameConfig.getSelectedCard().dataset.cardId, gameConfig.getTurn().closestCardId, gameConfig.getTurn().direction, gameConfig.getTurn().hiker)
          .then(() =>{
            gameConfig.resetPlayerConfig();
          });
      }
    }else {
      // fetch without hiker
      addCardToBoard(gameConfig.getSelectedCard().dataset.cardId, gameConfig.getTurn().closestCardId, gameConfig.getTurn().direction)
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