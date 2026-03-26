export class Scoring {
    constructor(board) {
        this.board = board;
    }

    calculateScore(x, y) {
        const card = this.board.getCard(x, y);
        if (!card || !card.victoryPointCondition) return 0;

        const { baseScore, score, selector, filter } = card.victoryPointCondition;
        let countedItems = 0;

        // 1. Determine Search Area based on Filter
        const searchArea = this.getSearchArea(x, y, filter);

        // 2. Count items based on Selector
        countedItems = this.countItems(searchArea, selector, card, x, y);

        return baseScore + (score * countedItems);
    }

    getSearchArea(x, y, filterType) {
        const area = [];
        const b = this.board;

        // Helper to add if valid
        const addCard = (cx, cy) => {
            if (b.isWithinBounds(cx, cy) && b.getCard(cx, cy)) {
                area.push({ x: cx, y: cy, card: b.getCard(cx, cy) });
            }
        };

        switch (filterType) {
            case "Or": // Orthogonal (up, down, left, right)
                addCard(x, y - 1); // North
                addCard(x, y + 1); // South
                addCard(x - 1, y); // West
                addCard(x + 1, y); // East
                break;

            case "Ne": // Neighbouring (all 8 surrounding)
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue; // Skip self normally
                        addCard(x + dx, y + dy);
                    }
                }
                break;

            case "Pa": // Path (connected orthogonally)
                const connectedStr = b.getConnectedCards(x, y);
                area.push(...connectedStr);
                break;

            case "DN": // Direction North (same column, strictly above?? or entire column based on rules usually)
                // Assuming it means 'every card above in same column' based on typical game rules
                for (let cy = 0; cy < y; cy++) {
                    addCard(x, cy);
                }
                break;

            case "DE": // Direction East (every card right in same row)
                for (let cx = x + 1; cx < b.size; cx++) {
                    addCard(cx, y);
                }
                break;
            
            // Note: RR, CC, RC are sometimes used as filter or selector. 
            // Usually RR = Row, CC = Column. If it's a filter, we'll scan the row/col.
        }

        return area;
    }

    countItems(searchArea, selector, sourceCard, sourceX, sourceY) {
        let count = 0;

        // Function to check if a single card matches selector
        const matchesSelector = (card) => {
            switch (selector) {
                case "AN": return card.animal === "AN";
                case "AC": return card.animal === "AC";
                case "AF": return card.animal === "AF";
                case "LM": return card.landscape === "LM";
                case "LF": return card.landscape === "LF";
                case "LL": return card.landscape === "LL";
                case "Hi": return card.hiker !== undefined && card.hiker !== null;
                default: return false; // Distinct animals/landscapes handled below
            }
        };

        if (["Ad", "Ld"].includes(selector)) {
            // Ad = Distinct Animals, Ld = Distinct Landscapes
            const distinctSet = new Set();
            for (const item of searchArea) {
                if (selector === "Ad" && item.card.animal) distinctSet.add(item.card.animal);
                if (selector === "Ld" && item.card.landscape) distinctSet.add(item.card.landscape);
            }
            return distinctSet.size;
        }

        if (["RR", "CC", "RC"].includes(selector)) {
             // If selector is RR/CC/RC, it usually means count across width of board row/cols.
             // We'll approximate this by counting full rows/cols logic.
             // Usually RR means count the number of cards in the same row.
             const b = this.board;
             if (selector === "RR" || selector === "RC") {
                 for(let i=0; i<b.size; i++) if(i !== sourceX && b.getCard(i, sourceY)) count++;
             }
             if (selector === "CC" || selector === "RC") {
                 for(let i=0; i<b.size; i++) if(i !== sourceY && b.getCard(sourceX, i)) count++;
             }
             return count;
        }

        // Default counting
        for (const item of searchArea) {
            if (matchesSelector(item.card)) count++;
        }

        // Special rule check: Hiker on same card occasionally counts
        if (selector === "Hi" && sourceCard.hiker !== undefined) {
             // In rules, "including this card". Can adjust based on deeper API parsing if needed.
             // Assuming we add it here just to support the logic possibility.
             count++;
        }

        return count;
    }
}
