// game configurations
const boardSize = 5; //HARDCODED

let hasPlacedHiker = false; // check to know if the player already has placed a hiker or not.
let placingHiker = false; // checks if player wants/ is placing a hiker.

let selectedCard = null; // card selected in hand by player.
// hikerPlacement gets initialized as undefined by default, i removed the "= undefined;" as Sonar complained about it 
let hikerPlacement; // the id of the card in the board where hiker neds to be placed.
let turn = null;

function getHasPlacedHiker() {
  return hasPlacedHiker;
}

function getPlacingHiker() {
  return placingHiker;
}

function getSelectedCard() {
  return selectedCard;
}

function getHikerPlacement() {
  return hikerPlacement;
}

function getTurn() {
  return turn;
}

function setHikerPlacement(cardId){
  hikerPlacement = cardId;
}
function setSelectedCard(card){
  selectedCard = card;
}

function changePlacingHikerState(){
  // switches the states (true = false) / (false = true).
  placingHiker = !placingHiker;
}


function resetPlayerConfig(){
  placingHiker = false;
  hasPlacedHiker = false;

  setHikerPlacement(null);
  setSelectedCard(null);
  setTurn(null);
};

function changePlacedHikerState(){
  hasPlacedHiker = !hasPlacedHiker;
  //true = false and false = true, to change the variable state in another file
}

function setTurn(move){
  turn = move;
}
export {boardSize, getSelectedCard, getPlacingHiker, getHikerPlacement, getHasPlacedHiker, getTurn,
  setHikerPlacement, setSelectedCard, changePlacingHikerState,resetPlayerConfig,changePlacedHikerState, setTurn};