import {safe} from "../logic/board-logic.js";
import {boardSize} from  "../game-config.js";

function highlightValidTiles(board) {
  for (let row = 0; row <  board.length; row++) {
    for (let col = 0; col <  board.length; col++) {

      const tile = board[row][col];
      const isEmpty = Number(tile.card) === 0;

      if (isEmpty && hasNeighborCard(row, col, board)) {
        glowTile(row, col);
      }
    }
  }
}

// get the closest card next to one.
function hasNeighborCard(row, col, board) {
  const up = safe(row + 1, col, board, boardSize);
  const right = safe(row, col - 1, board, boardSize);
  const down = safe(row - 1, col, board, boardSize);
  const left = safe(row, col + 1, board, boardSize);

  return up || right || down || left;
}

function glowTile(row, col){
  const index = row * boardSize + col;

  const tile = document.querySelector(`[data-index="${index}"]`);
  tile.classList.add("glow");
}

export {highlightValidTiles};