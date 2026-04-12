import {fetchGameDetails} from "./api/game-info.js";
import * as storageHandler from "./storage/storage-utils.js";

//renderers
import {renderLeaderboard} from "./renderers/leaderboard-renderer.js";
import {renderBoard} from "./renderers/gameboard-renderer.js";
import {renderHand} from "./renderers/hand-renderer.js";
import {remainingHikers} from "./renderers/hiker-renderer.js";

//board logic
import {handleTileClick, endTurnButton} from "./logic/board-logic.js";

let selectedCard = null;
// object that will store the moves done by the player.
let hasPlacedHiker = false;
let lastBoardState = null; // makes sure the browser knows whether the board the player sees is the same as the one saved in the server
let currentPlayer = null //new function to do this.


function init() {
  renderBoard();
  renderHand();

  addEventListeners();

  setProgressBar(); // sets the initial and max values of the progress bar
  tick(); // updates the progress bar every second

  gameLoop();
  renderLoop();

  remainingHikers();
  placeHikerOnCard();
}

function addEventListeners() {
   // for selecting a tile
  let $gameBoard = document.querySelector("#game-board");
  $gameBoard.addEventListener('click', handleTileClick, true);

  // for selecting a card
  const $hand = document.querySelector("#hand");
  $hand.addEventListener('click', selectCard, true);

  //hiker
  document.querySelector("#select-hiker-button").addEventListener("click", selectHiker);

  //endTurnButton
  document.querySelector("#end-turn-button").addEventListener("click", endTurn);
}

function renderLoop() {
  const gameId = Number(storageHandler.getGameId());
  
  fetchGameDetails(gameId).then(data => {  // This is currently the only reliable solution I found, if someone has a better idea then feel free to change it.
    if (data.finished) window.location.replace("end-screen.html");

    renderLeaderboard(data.players);
    updateCurrentPlayer(data);
   
    const currentBoard = JSON.stringify(data.board); // By turning the array into a string, the values can be compared. 
    if (currentBoard !== lastBoardState) { // If it would remain an array, this line would look at whether currentBoard and lastBoardState don't point to the same object in memory, which would always be true.
      lastBoardState = currentBoard;
      renderBoard();
    }
    setTimeout(renderLoop, 1000);
  });
}

function selectCard(e){
  const $clickedCard = e.target.closest('article.card');

  const allCardsInHand = document.querySelectorAll('#hand .card');
  allCardsInHand.forEach(card => {
      card.classList.remove('selected');
  });

  $clickedCard.classList.add('selected');

  selectedCard = $clickedCard;
}

function updateCurrentPlayer(data) {
  const currentHiker = data.currentHiker;  // gets the current hiker color.
  const currentPlayer = data.players.find(player => player.hiker === currentHiker); // finds the hiker which has the same color as current hiker

  if (currentPlayer) document.querySelector("#turn-name").textContent = `${currentPlayer.name}'s turn`; // the if statement is to make sure it only changes if .find() found a result
}

function updateProgressBar() {
  document.querySelector("progress").value += 1;
  if (document.querySelector("progress").value >= document.querySelector("progress").max) {
    document.querySelector("progress").value = 0;
    /*endturn()*/ //currently there is no end turn function
  }
}

function tick() {
  setInterval(updateProgressBar, 1000);
}

function setProgressBar() {
  /*document.querySelector("progress").max = loadFromStorage(timePerTurn)*/ //there is currently no timeperturn in localstorage
  document.querySelector("progress").max = 60; //temporary
}

function selectHiker(){
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

function endTurn() {
  const $endTurnButton = document.querySelector("#end-turn-button");
  const $selectHikerButton = document.querySelector("#select-hiker-button");

  $endTurnButton.disabled = true; // Disable the button to prevent multiple clicks
  $selectHikerButton.disabled = true;
  document.querySelector("progress").value = 0; // Reset the progress bar

  endTurnButton();
  renderHand();
  gameLoop();
}

function gameLoop() {
  const $endTurnButton = document.querySelector("#end-turn-button");
  const $selectHikerButton = document.querySelector("#select-hiker-button");
  fetchGameDetails(Number(storageHandler.getGameId()))
    .then(data => {
      if (data.currentHiker === storageHandler.getHiker()) {
        $endTurnButton.disabled = false; // Enable the button when it's the player's turn
        $selectHikerButton.disabled = false;
      } else setTimeout(gameLoop, 2000); // Check again after 2 second and will need to be put in different function dedicated to polling
    })
}

init();

export {
  selectedCard,
  hasPlacedHiker
}

// temp "working" leave button, needs a confirmation pop-up
document.querySelector("#leave-button").addEventListener("click", function() {
  window.location.href = "lobby-listing.html";
})