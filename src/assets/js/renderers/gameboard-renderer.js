import * as storageHandler from "../storage/storage-utils.js";
import {fetchAllCards} from "../api/card-info.js";
import {fetchGameBoard} from "../api/game-info.js";
import {renderCard} from "./hand-renderer.js";
import {highlightValidTiles} from "./legal-move-renderer.js";


function createDiv($tile, cardId, index) {
  // store metadata
  $tile.dataset.index = index;
  $tile.dataset.card = cardId;
}

function createTile(tile, cards, cardId, $emptyTile, index) {
  if (tile.card > 0) {
    const selectedCard = cards.find(card => card.id === cardId);
    //store metadata in div for selecting card
    createDiv($emptyTile, cardId, index);
    //render card
    if (tile.hiker === undefined){
      $emptyTile.appendChild(renderCard(selectedCard));
    }else {
      $emptyTile.appendChild(renderCard(selectedCard, true));
    }
  } else {
    createDiv($emptyTile, cardId, index);
  }
}

function renderBoard() {
  const $board = document.createDocumentFragment();
  const gameId = Number(storageHandler.getGameId());

  fetchAllCards().then(res => {
      return fetchGameBoard(gameId).then(boardObject => ({ res, boardObject }));
    })
    .then(({ res, boardObject }) => {
      populateBoard(boardObject.board, res.cards, $board);

      document.querySelector("#game-board").replaceChildren($board);

      highlightValidTiles(boardObject.board);
    });
}

function populateBoard(board, cards, $board) {
  let index = 0;

  board.forEach(row => {
    row.forEach(tile => {
      const $emptyTile = createTileElement(tile, cards, index);
      $board.appendChild($emptyTile);
      index++;
    });
  });
}

function createTileElement(tile, cards, index) {
  const cardId = tile.card;
  const $emptyTile = document
    .querySelector('#tile-template')
    .content.cloneNode(true);

  const $tile = $emptyTile.querySelector('.tile');

  createTile(tile, cards, cardId, $tile, index);

  return $emptyTile;
}


export {
  renderBoard
};