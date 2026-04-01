import {fetchAllCards} from "./api/card-info.js";
import {fetchGameDetails} from "./api/game-info.js";
import {loadFromStorage} from "./data-connector/local-storage-abstractor.js";
import {addCardToBoard} from "./api/place-card.js";
import {fetchFromServer} from "./data-connector/api-communication-abstractor.js";
import {fetchPlayerInfo} from "./api/player-info.js";

const arrayOfCards =
  [{id: 50, animal: "chamois", landscape: "mountain", victoryPointCondition: {basescore: 0, score: 1, selector: "HI", filter: "Pa"}},
  {id: 49, animal: "frog", landscape: "mountain", victoryPointCondition: {basescore: 0, score: 2, selector: "AN", filter: "Or"}},
  {id: 48, animal: "chamois", landscape: "forest", victoryPointCondition: {basescore: 1, score: 2, selector: "AC", filter: "Ne"}},
  {id: 1, animal: "chamois", landscape: "lake", victoryPointCondition: {basescore: 2, score: 1, selector: "AF", filter: "DN"}},
  {id: 22, animal: "nutcracker", landscape: "mountain", victoryPointCondition: {basescore: 0, score: 2, selector: "LM", filter: "DE"}},
  {id: 12, animal: "frog", landscape: "mountain", victoryPointCondition: {basescore: 1, score: 2, selector: "HI", filter: "DW"}}];
//for testing purposes

let selectedCard = null;
let currenBoard = null;

function init() {
  renderBoard();
  fetchFromServer(`/games/${loadFromStorage("gameId")}/hikers/${loadFromStorage("hiker")}/hand`).then(data => renderHand(data))

  // for selecting a tile
  let $gameBoard = document.querySelector("#game-board");
  $gameBoard.addEventListener('click', foo, true)

  // for selecting a card
  const $hand = document.querySelector("#hand")
  $hand.addEventListener('click', selectCard, true);

  setProgressBar(); // sets the initial and max values of the progress bar
  tick(); // updates the progress bar every second
  updateCurrentPlayer(); //must be used after the players turn has ended
}

function renderHand(cardArray) {
  let $fragment = document.createDocumentFragment();
  const $template = document.querySelector("#card-template");

  cardArray.hand.forEach(card => {
    const $clone = $template.content.cloneNode(true);
    $clone.querySelector("article").dataset.cardId = card.id;
    $clone.querySelector("img").src = `images/${card.animal}_${card.landscape}.png`;
    $clone.querySelector("p").textContent = `${card.victoryPointCondition.baseScore} + ${card.victoryPointCondition.score} / ${card.victoryPointCondition.selector} - ${card.victoryPointCondition.filter}`;
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
  console.log("Move geïnitieerd voor tile:", move.tile);
  getClosestCard(move.tile).then(closest => {
    if (closest) {
      return addCardToBoard(move.tile.dataset.id, closest.card, closest.direction)
    }
  });
}

function getClosestCard(tile){
  const tilePos = tile.dataset.id;

  const tilePosRow = Math.floor(tilePos / 5);
  const tilePosColumn = tilePos % 5;

  const size = 5;
  return fetchGameDetails(getGameId()).then(game=>{
    const currenBoard = game.board;

    // Checks whether a given (row, column) is inside the board
    // and if it contains a non‑zero card.
    const safe = (row, column) => {
      if (
        row >= 0 &&
        column >= 0 &&
        row < size &&
        column < size &&
        Number(currenBoard[row][column].card) !== 0
      ){const card = Number(currenBoard[row][column].card);
        return card !== 0 ? card : null;
      }
    };

    const up = safe(tilePosRow - 1, tilePosColumn);
    const right = safe(tilePosRow, tilePosColumn + 1);
    const down = safe(tilePosRow + 1, tilePosColumn);
    const left = safe(tilePosRow, tilePosColumn - 1);

    if (up) return { direction: "north", card : up };
    if (right) return { direction: "east", card: right };
    if (down) return { direction: "south", card: down };
    if (left) return { direction: "west", card: left };

    return null;
  });
}


function renderBoard(board) {
  return null;
}

function getGameId(){
  return loadFromStorage("gameId");
}

function updateCurrentPlayer() {

  fetchGameDetails(loadFromStorage("gameId"))
    .then(data =>{
      // gets the current hiker color.
      const currentHiker = data.currentHiker;
      data.players.forEach(player => {if(player.hiker === currentHiker) { // finds the hiker which has the same color as current hiker
        document.querySelector("#turn-name").textContent = `${player.name}'s turn`
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
  setInterval(updateProgressBar, 1000);
}

function setProgressBar() {
  /*document.querySelector("progress").max = loadFromStorage(timePerTurn)*/ //there is currently no timeperturn in localstorage
  document.querySelector("progress").max = 60; //temporary
}

init();