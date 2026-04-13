// game configurations
import {selectCard} from "./logic/game-logic.js";

const boardSize = 5 //HARDCODED

let hasPlacedHiker = false; // check to know if the player already has placed a hiker or not.
let placingHiker = false; // checks if player wants/ is placing a hiker.

let selectedCard = null; // card selected in hand by player.
let hikerPlacement = null; // the id of the card in the board where hiker neds to be placed.
let turn = null;

function setHikerPlacement(cardId){
  hikerPlacement = cardId;
}
function setSelectedCard(card){
  selectedCard = card;
}

function changePlacingHikerState(){
  // switches the states (true = false) / (false = true).
  placingHiker = !placingHiker
}


function resetPlayerConfig(){
  placingHiker = false;
  hasPlacedHiker = false;

  setHikerPlacement(null);
  setSelectedCard(null);
  setTurn(null);
}

function changePlacedHikerState(){
  hasPlacedHiker = !hasPlacedHiker;
  //true = false and false = true, to change the variable state in another file
}

function setTurn(move){
  turn = move;
}
export {boardSize, selectedCard, placingHiker, hikerPlacement,hasPlacedHiker,turn,
  setHikerPlacement, setSelectedCard, changePlacingHikerState,resetPlayerConfig,changePlacedHikerState, setTurn}