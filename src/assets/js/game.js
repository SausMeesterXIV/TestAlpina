import {fetchAllCards} from "./api/card-info.js";
import {fetchGameDetails,fetchGameBoard} from "./api/game-info.js";
import {loadFromStorage} from "./data-connector/local-storage-abstractor.js";
import {addCardToBoard, addCardToBoardWithHikerInHand} from "./api/place-card.js";
import {fetchPlayerHand} from "./api/player-info.js";
import {getGameId, getHiker} from "./storage-utils.js";
import { renderLeaderboard as leaderboardRenderer } from "./leaderboard-renderer.js";
import * as storageHandler from "./storage-utils.js";

const arrayOfCards =
  [{id: 50, animal: "chamois", landscape: "mountain", victoryPointCondition: {basescore: 0, score: 1, selector: "HI", filter: "Pa"}},
  {id: 49, animal: "frog", landscape: "mountain", victoryPointCondition: {basescore: 0, score: 2, selector: "AN", filter: "Or"}},
  {id: 48, animal: "chamois", landscape: "forest", victoryPointCondition: {basescore: 1, score: 2, selector: "AC", filter: "Ne"}},
  {id: 1, animal: "chamois", landscape: "lake", victoryPointCondition: {basescore: 2, score: 1, selector: "AF", filter: "DN"}},
  {id: 22, animal: "nutcracker", landscape: "mountain", victoryPointCondition: {basescore: 0, score: 2, selector: "LM", filter: "DE"}},
  {id: 12, animal: "frog", landscape: "mountain", victoryPointCondition: {basescore: 1, score: 2, selector: "HI", filter: "DW"}}];
//for testing purposes

let selectedCard = null;
// object that will store the moves done by the player.
let turn = null;
let hasPlacedHiker = false;

function init() {
  renderBoard();
  renderHand();

  addEventListeners();

  setProgressBar(); // sets the initial and max values of the progress bar
  tick(); // updates the progress bar every second

  gameLoop();
  renderLoop();
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
  placeHikerOnCard();
  remainingHikers();

  //endTurnButton
  document.querySelector("#end-turn-button").addEventListener("click", endTurn);
}

let lastBoardState = null; // makes sure the browser knows whether the board the player sees is the same as the one saved in the server

function renderLoop() {
  const gameId = storageHandler.getGameId();
  
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

function renderCard(card) {
  const $template = document.querySelector("#card-template");
  const $clone = $template.content.cloneNode(true);

  $clone.querySelector("article").dataset.cardId = card.id;
  $clone.querySelector("img").src = `images/${card.animal}_${card.landscape}.png`;
  $clone.querySelector("p").textContent = `${card.victoryPointCondition.baseScore} + ${card.victoryPointCondition.score} / ${card.victoryPointCondition.selector} - ${card.victoryPointCondition.filter}`;

  return $clone;
}

function renderHand() {
  let $fragment = document.createDocumentFragment();
  fetchPlayerHand().then(cardArray => {
    cardArray.forEach(card => {
      $fragment.appendChild(renderCard(card));
    });
    document.querySelector("#hand").replaceChildren($fragment);
  });
}


function hasHikerOnCardInHand(){
  const card = selectedCard.querySelector(".hiker");
  // if there is no hiker, the player sends card without hiker to server
  return !card.classList.contains("hidden"); // CHANGE TO HIKER LATER!
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

function getMove(tileId, selectedTile, cardId) {
  return {
    tileId: tileId,
    tile: selectedTile,
    cardId: cardId
  };
}

function handleSelectedCardPlacement(cardId, tileId, selectedTile) {
  if (selectedCard !== null) {
    if (Number(cardId) !== 0) {
      const move = getMove(tileId, selectedTile, cardId);
      placeCard(move);
    }
  }
}

function handleTileClick(e){
  const selectedTile = e.target.closest("div");
  const tileId = selectedTile.dataset.id;
  const cardId = selectedTile.dataset.cardId;

  handleSelectedCardPlacement(cardId, tileId, selectedTile);
}

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
}

function createTurn(cardId, closestCardId, direction){
  turn = {
    cardId,
    closestCardId,
    direction
  }
}


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
}


function getClosestCard(tile){
  // tile position based on 1 array value (0-24)
  const tilePos = tile.dataset.index;
  // size of the grid (5x5)
  const boardSize = 5;

  const size = 5;
  return fetchGameDetails(getGameId()).then(game=>{
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
}

function renderDiv($tile, cardId, index) {
  // store metadata
  $tile.dataset.index = index;
  $tile.dataset.card = cardId;
}

function renderTile(tile, cards, cardId, $emptyTile, index) {
  if (tile.card > 0) {
    const selectedCard = cards.find(card => card.id === cardId);
    //store metadata in div for selecting card
    renderDiv($emptyTile, cardId, index);
    //render card
    $emptyTile.appendChild(renderCard(selectedCard));
  } else {
    renderDiv($emptyTile, cardId, index);
  }
}

function renderBoard() {
  const $board = document.createDocumentFragment();
  const gameId = Number(storageHandler.getGameId());

  fetchAllCards().then(res =>{
    fetchGameBoard(gameId).then((res2) => {
      // indexing for tile id
      let index = 0;

      // loops trough board row.
      res2.board.forEach((row) =>{
        // loops true each card in the row.
        row.forEach((tile) => {
          const cardId = tile.card;
          const $emptyTile = document.querySelector('#tile-template').content.cloneNode(true);
          const $tile = $emptyTile.querySelector('.tile');

          renderTile(tile, res.cards, cardId, $tile, index);
          $board.appendChild($emptyTile);

          index++;
        });
      });
      document.querySelector("#game-board").replaceChildren($board); // Replace children prevents flickering
    });
  });
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

function renderLeaderboard(players) {
  const $target = document.querySelector("tbody");
  leaderboardRenderer(players, $target);
}

function selectHiker(){
  document.querySelector("main").classList.toggle("hiker-image");
}



function placeHikerOnCard() {
  let canPlayHiker = true;
  const gameId = Number(loadFromStorage("gameId"))
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

function remainingHikers() {
  const $button = document.querySelector("#select-hiker-button");
  const gameId = Number(loadFromStorage("gameId"));
  const currentPlayer ="purple";
  const text = document.querySelector("span");

  fetchGameDetails(gameId)
    .then(data => data.players)
    .then(players => {
      players.forEach(player => {
        if (player.hiker === currentPlayer){
          const hikers = player.hikersLeft;
          text.textContent = hikers;
          $button.appendChild(text);
        }
      })

    })
}

function endTurnButton(){
  if (turn !== null){
    if (hasPlacedHiker){
      // fetch with hiker
      addCardToBoardWithHikerInHand(selectedCard.dataset.cardId, turn.closestCardId, turn.direction)
        .then(() =>{
          // TODO: clear hasplacedhiker and the selectedcard.
        });
    }else {
      // fetch without hiker
      addCardToBoard(selectedCard.dataset.cardId, turn.closestCardId, turn.direction)
        .then(() =>{
        // TODO: clear hasplacedhiker and the selectedcard.
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
  renderHand();
  gameLoop();
}

function gameLoop() {
  const $endTurnButton = document.querySelector("#end-turn-button");
  const $selectHikerButton = document.querySelector("#select-hiker-button");
  fetchGameDetails(getGameId())
    .then(data => {
      if (data.currentHiker === getHiker()) {
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
