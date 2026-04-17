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

          createTile(tile, res.cards, cardId, $tile, index);
          $board.appendChild($emptyTile);

          index++;
        });
      });
      document.querySelector("#game-board").replaceChildren($board);// Replace children prevents flickering
      highlightValidTiles(res2.board); // highlights all the tiles where you can place cards.
    });
  });
} //the playing field


export {
  renderBoard
};