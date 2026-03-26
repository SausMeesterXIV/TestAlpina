import {fetchAllCards} from "./api/card-info.js";
import {fetchFromServer} from "./data-connector/api-communication-abstractor.js";

const arrayOfCards =
  [{id: 50, animal: "chamois", landscape: "mountain", victoryPointCondition: {basescore: 0, score: 2, selector: "DW", filter: "HI"}},
  {id: 50, animal: "chamois", landscape: "mountain", victoryPointCondition: {basescore: 0, score: 2, selector: "DW", filter: "HI"}},
  {id: 50, animal: "chamois", landscape: "mountain", victoryPointCondition: {basescore: 0, score: 2, selector: "DW", filter: "HI"}},
  {id: 50, animal: "chamois", landscape: "mountain", victoryPointCondition: {basescore: 0, score: 2, selector: "DW", filter: "HI"}},
  {id: 50, animal: "chamois", landscape: "mountain", victoryPointCondition: {basescore: 0, score: 2, selector: "DW", filter: "HI"}},
  {id: 50, animal: "chamois", landscape: "mountain", victoryPointCondition: {basescore: 0, score: 2, selector: "DW", filter: "HI"}}]
//for testing purposes


function init() {
  fetchAllCards();
  renderHand(arrayOfCards);
}

function renderHand(cardArray) {
  let $fragment = document.createDocumentFragment();
  const $template = document.querySelector("#card-template");


  cardArray.forEach(card => {
    const $clone = $template.content.cloneNode(true);
    $clone.querySelector("article").id = card.id;
    $clone.querySelector("img").src = `images/${card.animal}_${card.landscape}.png`;
    $clone.querySelector("p").textContent = `${card.victoryPointCondition.selector} - ${card.victoryPointCondition.filter}`;
    $fragment.appendChild($clone);
  })

  document.querySelector("#hand").appendChild($fragment);
}


init();