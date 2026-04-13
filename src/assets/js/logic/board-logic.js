import * as config from "../config.js";
import * as variables from "../game.js";
import * as storageHandler from "../storage/storage-utils.js";

import {addCardToBoard, addCardToBoardWithHiker} from "../api/place-card.js";
import {fetchGameDetails} from "../api/game-info.js";
import {changePlacedHikerState, hasPlacedHiker, selectedCard} from "../game.js";
import {resetPlayerConfig} from "../config.js";


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
  if (variables.selectedCard !== null) { // card that player wants to place
    if (Number(cardId) === 0) { // if tile is empty place card.
      const move = getMove(tileId, selectedTile, cardId);
      placeCard(move);
    }
  }
}

function handleTileClick(e){
  const selectedTile = e.target.closest("div");
  const tileId = selectedTile.dataset.index;
  const cardId = selectedTile.dataset.card;

  if (config.placingHiker){ // if player wants to place a hiker on a card
    // place hiker on board.
    handleHikerPlacePlacement(cardId);
  }else{ // place card.
    handleSelectedCardPlacement(cardId, tileId, selectedTile);
  }
}

function handleHikerPlacePlacement(cardId){
  if (!hasPlacedHiker){
    config.setHikerPlacement(cardId);
    changePlacedHikerState();
    console.log(hasPlacedHiker);
    console.log("placed hiker on card:" + cardId);
    // TODO: make it so visualy there is placed a card.
  }
}

function placeCard(move){
  console.log("Move geïnitieerd voor tile:", move.tile);
  getClosestCard(move.tile).then(closest => {
    if (closest) {
      if (hasHikerOnCardInHand()){
        // hiker is placed on card in hand.
        variables.changePlacedHikerState()
        createTurn(variables.selectedCard.dataset.cardId, closest.card, closest.direction);
      } else if(selectedCard !== null){
        // hiker is placed on card on board so needs card id of other card.
        createTurnWithHiker(variables.selectedCard.dataset.cardId, closest.card, closest.direction, config.hikerPlacement);
      }else{
        // no hiker selected so only card needed.
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

function createTurnWithHiker(cardId, closestCardId, direction, hiker){
  turn = {
    cardId,
    closestCardId,
    direction,
    hiker
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
  const boardSize = config.boardSize;

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
    console.log(variables.hasPlacedHiker);
    if (variables.hasPlacedHiker){
      if(turn.hiker !== undefined){
        addCardToBoardWithHiker(variables.selectedCard.dataset.cardId, turn.closestCardId, turn.direction, turn.hiker).then(() =>{
          clearTurnInfo();
        })
      }else {
        // fetch with hiker
        addCardToBoardWithHiker(variables.selectedCard.dataset.cardId, turn.closestCardId, turn.direction)
          .then(() =>{
            clearTurnInfo();
          });
      }
    }else {
      // fetch without hiker
      addCardToBoard(variables.selectedCard.dataset.cardId, turn.closestCardId, turn.direction)
        .then(() =>{
          clearTurnInfo();
        });
    }
  }
}

function clearTurnInfo(){
  resetPlayerConfig(); // reset all values in the config.
  turn = null; // TODO: MAYBE SET THIS IN CONFIG TO ??
  variables.selectedCard = null; // TODO IDEM TURN ??
  variables.hasPlacedHiker = false; // ALSO IN CONFIG ? or make a new file game config ?
}

export {
  handleTileClick,
  endTurnButton
}