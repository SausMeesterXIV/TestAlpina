import {fetchGameDetails} from "./api/game-info.js";
import {addCardToBoard, addCardToBoardWithHikerInHand} from "./api/place-card.js";
import * as storageHandler from "./storage/storage-utils.js";

//renderers
import {renderLeaderboard} from "./renderers/leaderboard-renderer.js";
import {renderBoard} from "./renderers/gameboard-renderer.js";
import {renderHand} from "./renderers/hand-renderer.js";
import {remainingHikers} from "./renderers/hiker-renderer.js";

let selectedCard = null;
// object that will store the moves done by the player.
let turn = null;
let hasPlacedHiker = false;
let lastBoardState = null; // makes sure the browser knows whether the board the player sees is the same as the one saved in the server
let currentPlayer = null //new fucntion to do this.


function init() {
  renderBoard();

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
      renderHand(); //put into endTurn function
      remainingHikers(); //put into endTurn function
    }
    setTimeout(renderLoop, 1000);
  });
}

function selectCard(e){
  //TODO:change the css + add the css.
  selectedCard = e.target.closest('article');
} //board logic

function hasHikerOnCardInHand(){
  const card = selectedCard.querySelector(".hiker");
  // if there is no hiker, the player sends card without hiker to server
  return !card.classList.contains("hidden"); // CHANGE TO HIKER LATER!
}

function getMove(tileId, selectedTile, cardId) {
  return {
    tileId: tileId,
    tile: selectedTile,
    cardId: cardId
  };
} //board logic

function handleSelectedCardPlacement(cardId, tileId, selectedTile) {
  if (selectedCard !== null) {
    if (Number(cardId) !== 0) {
      const move = getMove(tileId, selectedTile, cardId);
      placeCard(move);
    }
  }
} //board logic

function handleTileClick(e){
  const selectedTile = e.target.closest("div");
  const tileId = selectedTile.dataset.id;
  const cardId = selectedTile.dataset.cardId;

  handleSelectedCardPlacement(cardId, tileId, selectedTile);
} //board logic

function placeCard(move){
  console.log("Move geïnitieerd voor tile:", move.tile);
  getClosestCard(move.tile).then(closest => {
    if (closest) {
      if (hasHikerOnCardInHand()){
        hasPlacedHiker = true;
        createTurn(selectedCard.dataset.cardId, closest.card, closest.direction);
        // TODO: check where the hiker is placed on the grid not only in the hand.
      }else{
        createTurn(selectedCard.dataset.cardId, closest.card, closest.direction);
      }
    }
  });
} //board logic

function createTurn(cardId, closestCardId, direction){
  turn = {
    cardId,
    closestCardId,
    direction
  }
} //board logic

function safe(row,column,currentBoard, size){
  const inBounds = row >= 0 && column >= 0 && row < size && column < size;

  if (currentBoard?.[row]?.[column] === undefined) {
    return null;
  }else{
    const hasCard = Number(currentBoard[row][column].card) === 0;

    if(inBounds && !hasCard){
      const card = Number(currentBoard[row][column].card);
      // returns null when there is no card
      return card !== 0 ? card : null;
    }
  }
} //board logic

function getClosestCard(tile){
  // tile position based on 1 array value (0-24)
  const tilePos = tile.dataset.index;
  // size of the grid (5x5)
  const boardSize = 5;

  const size = 5;
  return fetchGameDetails(Number(storageHandler.getGameId())).then(game=>{
    const currentBoard = game.board;
    // tile position based on 2D Array
    const tilePosRow = Math.floor(tilePos / boardSize);
    const tilePosColumn = tilePos % boardSize;
    //SAFE: Checks whether a given (row, column) is inside the board
    //and if it contains a non‑zero card.
    const up = safe(tilePosRow + 1, tilePosColumn, currentBoard, boardSize);
    const right = safe(tilePosRow, tilePosColumn - 1, currentBoard, boardSize);
    const down = safe(tilePosRow - 1, tilePosColumn, currentBoard, boardSize);
    const left = safe(tilePosRow, tilePosColumn + 1, currentBoard, boardSize);


    if (up) return { direction: "north", card : up };
    if (right) return { direction: "east", card: right };
    if (down) return { direction: "south", card: down };
    if (left) return { direction: "west", card: left };

    return null;
  });
} //board logic

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

function endTurnButton(){
  if (turn !== null){
    if (hasPlacedHiker){
      // fetch with hiker
      addCardToBoardWithHikerInHand(selectedCard.dataset.cardId, turn.closestCardId, turn.direction)
        .then(() =>{
          // clear hasplacedhiker and the selectedcard.
        });
    }else {
      // fetch without hiker
      addCardToBoard(selectedCard.dataset.cardId, closest.card, closest.direction)
        .then(() =>{
        // clear hasplacedhiker and the selectedcard.
      });
    }
  }
}

function endTurn() {
  const $endTurnButton = document.querySelector("#end-turn-button");
  const $selectHikerButton = document.querySelector("#select-hiker-button");

  $endTurnButton.disabled = true; // Disable the button to prevent multiple clicks
  $selectHikerButton.disabled = true;
  document.querySelector("progress").value = 0; // Reset the progress bar

  endTurnButton();
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


// temp
document.querySelector("#leave-button").addEventListener("click", function() {
  window.location.href = "lobby-listing.html";
})