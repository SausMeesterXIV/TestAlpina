import {fetchAllCards} from "./api/card-info.js";
import {fetchFromServer} from "./data-connector/api-communication-abstractor.js";
import {fetchPlayerInfo} from "./api/player-info.js";
import {loadFromStorage, saveToStorage} from "./data-connector/local-storage-abstractor.js";
import {fetchGameDetails, fetchSpecificGame} from "./api/game-info.js";

const arrayOfCards =
  [{id: 50, animal: "chamois", landscape: "mountain", victoryPointCondition: {basescore: 0, score: 1, selector: "HI", filter: "Pa"}},
  {id: 49, animal: "frog", landscape: "mountain", victoryPointCondition: {basescore: 0, score: 2, selector: "AN", filter: "Or"}},
  {id: 48, animal: "chamois", landscape: "forest", victoryPointCondition: {basescore: 1, score: 2, selector: "AC", filter: "Ne"}},
  {id: 1, animal: "chamois", landscape: "lake", victoryPointCondition: {basescore: 2, score: 1, selector: "AF", filter: "DN"}},
  {id: 22, animal: "nutcracker", landscape: "mountain", victoryPointCondition: {basescore: 0, score: 2, selector: "LM", filter: "DE"}},
  {id: 12, animal: "frog", landscape: "mountain", victoryPointCondition: {basescore: 1, score: 2, selector: "HI", filter: "DW"}}]
//for testing purposes


function init() {
  renderHand(arrayOfCards);
  setProgressBar(); // sets the initial and max values of the progress bar
  tick(); // updates the progress bar every second
  updateCurrentPlayer(); //must be used after the players turn has ended
}

function renderHand(cardArray) {
  let $fragment = document.createDocumentFragment();
  const $template = document.querySelector("#card-template");


  cardArray.forEach(card => {
    const $clone = $template.content.cloneNode(true);
    $clone.querySelector("article").dataset.cardId = card.id;
    $clone.querySelector("img").src = `images/${card.animal}_${card.landscape}.png`;
    $clone.querySelector("p").textContent = `${card.victoryPointCondition.basescore} + ${card.victoryPointCondition.score} / ${card.victoryPointCondition.selector} - ${card.victoryPointCondition.filter}`;
    $fragment.appendChild($clone);
  })

  document.querySelector("#hand").appendChild($fragment);
}


function updateCurrentPlayer() {

  fetchGameDetails(loadFromStorage("gameId")).then(players =>{
    // gets the current hiker color.
    const currentHiker = players.currentHiker;
    players.players.forEach(player => {if(player.hiker === currentHiker) { // finds the hiker which has the same color as current hiker
      document.querySelector("em").textContent = `${player.name}'s turn`
    }})
  })
}


function updateProgressBar() {
  document.querySelector("progress").value += 1;
  if (document.querySelector("progress").value >= document.querySelector("progress").max) {
    document.querySelector("progress").value = 0;
    updateCurrentPlayer();
    /*endturn()*/ //currently there is no end turn function
  }
}

function tick() {
  setInterval(updateProgressBar, 100);
}

function setProgressBar() {
  /*document.querySelector("progress").max = loadFromStorage(timePerTurn)*/ //there is currently no timeperturn in localstorage
  document.querySelector("progress").max = 60; //temporary
}


init();