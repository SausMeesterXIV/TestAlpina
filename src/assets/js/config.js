const GROUPNUMBER = "14";
const GROUPTOKEN = "group14-9562-183";

const ERRORHANDLERSELECTOR = ".errormessages p";

const LOCALSERVER = `http://localhost:8080`;
const DEPLOYEDSERVER = `https://project-1.ti.howest.be/2025-2026/alpina/api`;
const GROUPDEPLOYEDSERVER = `https://project-1.ti.howest.be/2025-2026/group-${GROUPNUMBER}/api`;

// game configurations
const boardSize = 5 //HARDCODED

let placingHiker = false; // checks if player wants/ is placing a hiker.
let hikerPlacement = null; // the id of the card in the board where hiker neds to be placed.

function setHikerPlacement(cardId){
  hikerPlacement = cardId;
}
function changePlacingHikerState(){
  // switches the states (true = false) / (false = true).
  placingHiker = !placingHiker
}

function getAPIUrl() {
  return DEPLOYEDSERVER;
}

export { getAPIUrl, GROUPTOKEN, ERRORHANDLERSELECTOR, boardSize, placingHiker, hikerPlacement, setHikerPlacement, changePlacingHikerState};
