import {fetchGameDetails} from "../api/game-info.js";
import * as storageHandler from "../storage/storage-utils.js"
import {changePlacingHikerState} from "../config.js";

let selectedCard = null;

function selectCard(e){
  const $clickedCard = e.target.closest('article.card');

  const allCardsInHand = document.querySelectorAll('#hand .card');
  allCardsInHand.forEach(card => {
    card.classList.remove('selected');
  });

  $clickedCard.classList.add('selected');

  selectedCard = $clickedCard;
}

function updateProgressBar() {
  document.querySelector("progress").value += 1;
  if (document.querySelector("progress").value >= document.querySelector("progress").max) {
    document.querySelector("progress").value = 0;
    /*endturn()*/ //currently there is no end turn function, for sprint 3
  }
}

function setTimeProgressBar() {
  /*document.querySelector("progress").max = loadFromStorage(timePerTurn)*/ //there is currently no timeperturn in localstorage
  document.querySelector("progress").max = 60; //temporary HARDCODED
}

function selectHiker(){
  changePlacingHikerState();
  document.querySelector("main").classList.toggle("hiker-image");
}

function placeHikerOnCard() {
  let canPlayHiker = true;
  const gameId = Number(storageHandler.getGameId())
  fetchGameDetails(gameId)
    .then(data => data.players)
    .then(players => {
      players.forEach(player => {
        if (player.hikersLeft <= 0) {
          canPlayHiker = false;
        }
      })
      if (canPlayHiker){
        const cards = document.querySelectorAll(".card"); // class/selector needs to be changed so only the cards in a grid are selected
        const hiker = document.querySelector(".hiker");
        const main = document.querySelector("main");

        //following code up for change
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
    })
}

export {
  selectCard,
  updateProgressBar,
  setTimeProgressBar,
  selectHiker,
  placeHikerOnCard,
  selectedCard
}