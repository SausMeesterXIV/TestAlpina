import { Board } from './logic/Board.js';
import { Scoring } from './logic/Scoring.js';
import { getHand } from './data/mockCards.js';

class GameController {
    constructor() {
        this.board = new Board(5);
        this.scoring = new Scoring(this.board);
        this.hand = getHand();
        this.selectedCardIndex = null;
        this.points = 0;

        this.initUI();
    }

    initUI() {
        this.renderBoard();
        this.renderHand();
        this.updateScoreUI();
        
        // Setup listener for board clicks
        document.getElementById('game-board').addEventListener('click', (e) => this.handleBoardClick(e));
    }

    renderBoard() {
        const boardEl = document.getElementById('game-board');
        boardEl.innerHTML = ''; // Clear existing static divs
        
        const grid = this.board.getGrid();
        for (let y = 0; y < this.board.size; y++) {
            for (let x = 0; x < this.board.size; x++) {
                const cellEl = document.createElement('div');
                cellEl.classList.add('board-cell');
                cellEl.dataset.x = x;
                cellEl.dataset.y = y;

                const card = grid[y][x];
                if (card) {
                    this.renderCardInside(cellEl, card);
                }

                boardEl.appendChild(cellEl);
            }
        }
    }

    renderHand() {
        const handEl = document.getElementById('hand');
        handEl.innerHTML = ''; // Clear

        this.hand.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.classList.add('hand-card');
            if (this.selectedCardIndex === index) {
                cardEl.classList.add('selected');
            }
            
            this.renderCardInside(cardEl, card);
            cardEl.addEventListener('click', () => this.selectCard(index));
            handEl.appendChild(cardEl);
        });
    }

    renderCardInside(container, card) {
        // Minimal visual representation based on mock data
        container.innerHTML = `
            <div class="card-animal">${card.animal}</div>
            <div class="card-landscape">${card.landscape}</div>
            <div class="card-vp">+${card.victoryPointCondition.score} (${card.victoryPointCondition.selector}|${card.victoryPointCondition.filter})</div>
        `;
        // Temporary styling inline so it doesn't break if CSS classes are missing
        container.style.border = "1px solid #333";
        container.style.backgroundColor = "#fff";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.fontSize = "0.8rem";
        container.style.cursor = "pointer";
    }

    selectCard(index) {
        if (this.selectedCardIndex === index) {
            this.selectedCardIndex = null; // deselect
        } else {
            this.selectedCardIndex = index;
        }
        this.renderHand();
    }

    handleBoardClick(event) {
        const cell = event.target.closest('.board-cell');
        if (!cell) return;

        const x = parseInt(cell.dataset.x, 10);
        const y = parseInt(cell.dataset.y, 10);

        // Try placing selected card
        if (this.selectedCardIndex !== null) {
            const cardToPlace = this.hand[this.selectedCardIndex];
            
            if (this.board.placeCard(x, y, cardToPlace)) {
                // Remove from hand
                this.hand.splice(this.selectedCardIndex, 1);
                this.selectedCardIndex = null;
                
                // Calculate score
                const pointsEarned = this.scoring.calculateScore(x, y);
                this.points += pointsEarned;
                
                // Update UI
                this.renderBoard();
                this.renderHand();
                this.updateScoreUI();

                // Alert user of points gained for feedback
                console.log(`Placed card at (${x},${y}). Earned ${pointsEarned} points.`);
            } else {
                alert("Cannot place card here - spot is taken.");
            }
        }
    }

    updateScoreUI() {
        // Update the points in the leaderboard table for the first player as a mock
        const leaderboardBody = document.querySelector('#leaderboard tbody');
        if (leaderboardBody && leaderboardBody.firstElementChild) {
            const row = leaderboardBody.firstElementChild;
            const pointsCell = row.querySelectorAll('td')[3];
            if (pointsCell) {
                pointsCell.textContent = this.points;
            }
        }
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.gameController = new GameController();
});
