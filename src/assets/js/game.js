import {fetchAllCards} from "./api/card-info.js";
import {fetchFromServer} from "./data-connector/api-communication-abstractor.js";
import {fetchPlayerInfo} from "./api/player-info.js";
import {loadFromStorage} from "./data-connector/local-storage-abstractor.js";
import {fetchSpecificGame} from "./api/game-info.js";

const playingOrder = [];
let count = 0;
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
  setProgressBar();
  tick();
  updateCurrentPlayer();
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

  fetchSpecificGame( 7 /*loadFromStorage("gameId")*/).then(players =>{
    // gets the current hiker color.
    const currentHiker = players.currentHiker;
    console.log(currentHiker);
  })
  /*document.querySelector("aside em").textContent = */
}


function updateProgressBar() {
  document.querySelector("progress").value += 1;
  if (document.querySelector("progress").value >= document.querySelector("progress").max) {
    document.querySelector("progress").value = 0;
    count++;
    if (count >= 4) {
      count = 0;
    }
    updateCurrentPlayer();
    /*endturn()*/
  }
}

function tick() {
  setInterval(updateProgressBar, 100);
}

function setProgressBar() {
  /*document.querySelector("progress").max = loadFromStorage(timePerTurn)*/
  document.querySelector("progress").max = 60; //temporary
}

/*function establishPlayingOrder() {
  fetchPlayerInfo(loadFromStorage("gameId")).then(players => {
    for (let i = 0; i < players.length; i++) {
      playingOrder.push(players[i].hiker);
    }
    console.log(playingOrder);
  })

}*/


init();