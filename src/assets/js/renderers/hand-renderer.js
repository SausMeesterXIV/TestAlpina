import {fetchPlayerHand} from "../api/player-info.js";

function renderCard(card, placeHiker = false) {
  const $template = document.querySelector("#card-template");
  const $clone = $template.content.cloneNode(true);

  $clone.querySelector("article").dataset.cardId = card.id;
  $clone.querySelector("img").src = `images/${card.animal}_${card.landscape}.png`;
  $clone.querySelector("p").textContent = `${card.victoryPointCondition.baseScore} + ${card.victoryPointCondition.score} / ${card.victoryPointCondition.selector} - ${card.victoryPointCondition.filter}`;

  if (placeHiker){
    console.log("removehiker");
    $clone.querySelector('.hiker').classList.remove('hidden');
  }

  return $clone;
}

function renderHand() {
  const $fragment = document.createDocumentFragment();
  fetchPlayerHand().then(cardArray => {
    cardArray.forEach(card => {
      $fragment.appendChild(renderCard(card));
    });
    document.querySelector("#hand").replaceChildren($fragment);
  });
}

export {
  renderHand,
  renderCard
};