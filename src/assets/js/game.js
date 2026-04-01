import {fetchAllCards} from "./api/card-info.js";
import {fetchFromServer} from "./data-connector/api-communication-abstractor.js";
import {loadFromStorage} from "./data-connector/local-storage-abstractor.js";
import {fetchSpecificGame} from "./api/game-info.js";

const arrayOfCards =
  [{id: 50, animal: "chamois", landscape: "mountain", victoryPointCondition: {basescore: 0, score: 1, selector: "HI", filter: "Pa"}},
  {id: 49, animal: "frog", landscape: "mountain", victoryPointCondition: {basescore: 0, score: 2, selector: "AN", filter: "Or"}},
  {id: 48, animal: "chamois", landscape: "forest", victoryPointCondition: {basescore: 1, score: 2, selector: "AC", filter: "Ne"}},
  {id: 1, animal: "chamois", landscape: "lake", victoryPointCondition: {basescore: 2, score: 1, selector: "AF", filter: "DN"}},
  {id: 22, animal: "nutcracker", landscape: "mountain", victoryPointCondition: {basescore: 0, score: 2, selector: "LM", filter: "DE"}},
  {id: 12, animal: "frog", landscape: "mountain", victoryPointCondition: {basescore: 1, score: 2, selector: "HI", filter: "DW"}}]
//for testing purposes

let selectedCard = null;

function init() {
  // for selecting a card
  const $hand = document.querySelector("#hand")
  $hand.addEventListener('click', selectCard, true);

  // for selecting a tile
  renderHand(arrayOfCards);

  let $gameBoard = document.querySelector("#game-board");
  $gameBoard.addEventListener('click', foo, true);

  //hiker
  document.querySelector("#select-hiker-button").addEventListener("click", selectHiker);
  placeHikerOnCard();
  remainingHikers();
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

function selectCard(e){
  //TODO:change the css + add the css.
  selectedCard = e.target.closest('article');
}

function foo(e){
  const selectedTile = e.target.closest("div");
  const tileId = selectedTile.dataset.id;
  const cardId = selectedTile.dataset.cardId;

  if (selectedCard !== null){
    if (Number(cardId) !== 0) {
      const move = {
        tileId: tileId,
        tile: selectedTile,
        cardId: cardId
      };
      placeCard(move);
    }
  }
}

function placeCard(move){
  console.log("move");
}

function selectHiker(){
  document.querySelector("main").classList.toggle("hiker-image");
}

function placeHikerOnCard() {
  if (remainingHikers() > 0) {

    const cards = document.querySelectorAll(".card"); // class/selector needs to be changed so only the cards in a grid are selected
    const hiker = document.querySelector(".hiker");
    const main = document.querySelector("main");

    cards.forEach(card => {
      card.addEventListener("click", () => {
        //this code moves the hiker
        if (main.classList.contains("hiker-image")) {
          card.appendChild(hiker);
          hiker.classList.remove("hidden");
        }
      });
    });
  }
}

function remainingHikers() {
  const $button = document.querySelector("#select-hiker-button");
  const gameId = loadFromStorage("gameId");
  const players = fetchSpecificGame(gameId).players;
  const hikers = players[3];
  const p = document.createElement("p");

  p.textContent = hikers;
  p.classList.add("hikers-left");
  $button.appendChild(p);

  return hikers;
}
init();