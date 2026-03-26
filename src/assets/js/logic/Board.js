export class Board {
    constructor(size = 5) {
        this.size = size;
        this.grid = Array.from({ length: size }, () => Array(size).fill(null));
    }

    placeCard(x, y, card) {
        if (this.isWithinBounds(x, y) && this.grid[y][x] === null) {
            this.grid[y][x] = card;
            return true;
        }
        return false;
    }

    placeHiker(x, y, hikerId) {
        if (this.isWithinBounds(x, y) && this.grid[y][x] !== null) {
            this.grid[y][x].hiker = hikerId;
            return true;
        }
        return false;
    }

    getCard(x, y) {
        if (this.isWithinBounds(x, y)) {
            return this.grid[y][x];
        }
        return null;
    }

    isWithinBounds(x, y) {
        return x >= 0 && x < this.size && y >= 0 && y < this.size;
    }

    getGrid() {
        return this.grid;
    }

    // Helper to get connected path (Pa filter) starting from specific location
    getConnectedCards(startX, startY) {
        const visited = new Set();
        const path = [];
        const queue = [{x: startX, y: startY}];

        while(queue.length > 0) {
            const current = queue.shift();
            const key = `${current.x},${current.y}`;

            if (!visited.has(key)) {
                visited.add(key);
                const card = this.getCard(current.x, current.y);
                if (card) {
                    if (current.x !== startX || current.y !== startY) {
                        path.push({x: current.x, y: current.y, card});
                    }
                    // Add neighbors
                    const neighbors = [
                        {x: current.x, y: current.y - 1},
                        {x: current.x, y: current.y + 1},
                        {x: current.x - 1, y: current.y},
                        {x: current.x + 1, y: current.y}
                    ];

                    for (const n of neighbors) {
                        if (this.isWithinBounds(n.x, n.y) && this.getCard(n.x, n.y)) {
                            queue.push(n);
                        }
                    }
                }
            }
        }
        return path;
    }
}
