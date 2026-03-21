class Game2048 {
    constructor() {
        this.size = 4;
        this.grid = [];
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('2048-best')) || 0;
        this.won = false;
        this.over = false;
        
        this.tileContainer = document.getElementById('tileContainer');
        this.scoreContainer = document.getElementById('score');
        this.bestContainer = document.getElementById('bestScore');
        this.messageContainer = document.getElementById('gameMessage');
        
        this.setup();
        this.actuate();
    }
    
    setup() {
        const gridContainer = document.querySelector('.grid-container');
        this.tileContainer.style.position = 'absolute';
        this.tileContainer.style.zIndex = '2';
        
        // Position tile container over grid
        const rect = gridContainer.getBoundingClientRect();
        this.tileContainer.style.left = gridContainer.offsetLeft + 'px';
        this.tileContainer.style.top = gridContainer.offsetTop + 'px';
        this.tileContainer.style.width = gridContainer.offsetWidth + 'px';
        this.tileContainer.style.height = gridContainer.offsetHeight + 'px';
        
        this.restart();
        this.bindEvents();
    }
    
    restart() {
        this.score = 0;
        this.over = false;
        this.won = false;
        this.keepPlaying = false;
        
        this.grid = this.empty();
        this.addRandomTile();
        this.addRandomTile();
        
        this.actuate();
    }
    
    bindEvents() {
        document.addEventListener('keydown', (event) => {
            if (this.over && !this.keepPlaying) return;
            
            let modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
            let mapped = false;
            
            if (!modifiers) {
                switch (event.which) {
                    case 37: // Left
                        mapped = true;
                        this.move(3);
                        break;
                    case 38: // Up
                        mapped = true;
                        this.move(0);
                        break;
                    case 39: // Right
                        mapped = true;
                        this.move(1);
                        break;
                    case 40: // Down
                        mapped = true;
                        this.move(2);
                        break;
                }
            }
            
            if (mapped) {
                event.preventDefault();
            }
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });
        
        document.getElementById('tryAgainBtn').addEventListener('click', () => {
            this.restart();
        });
        
        // Touch events for mobile
        this.bindTouchEvents();
    }
    
    bindTouchEvents() {
        let startX, startY;
        
        document.addEventListener('touchstart', (event) => {
            if (event.touches.length > 1) return;
            
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
            event.preventDefault();
        });
        
        document.addEventListener('touchmove', (event) => {
            event.preventDefault();
        });
        
        document.addEventListener('touchend', (event) => {
            if (event.touches.length > 0) return;
            
            let dx = event.changedTouches[0].clientX - startX;
            let dy = event.changedTouches[0].clientY - startY;
            let absDx = Math.abs(dx);
            let absDy = Math.abs(dy);
            
            if (Math.max(absDx, absDy) > 10) {
                if (absDx > absDy) {
                    this.move(dx > 0 ? 1 : 3);
                } else {
                    this.move(dy > 0 ? 2 : 0);
                }
            }
        });
    }
    
    empty() {
        let grid = [];
        for (let x = 0; x < this.size; x++) {
            let row = grid[x] = [];
            for (let y = 0; y < this.size; y++) {
                row.push(null);
            }
        }
        return grid;
    }
    
    addRandomTile() {
        let cells = this.availableCells();
        if (cells.length) {
            let value = Math.random() < 0.9 ? 2 : 4;
            let tile = { x: cells[Math.floor(Math.random() * cells.length)].x, 
                        y: cells[Math.floor(Math.random() * cells.length)].y, 
                        value: value };
            this.grid[tile.x][tile.y] = tile;
        }
    }
    
    availableCells() {
        let cells = [];
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                if (!this.grid[x][y]) {
                    cells.push({ x: x, y: y });
                }
            }
        }
        return cells;
    }
    
    move(direction) {
        let self = this;
        
        if (this.isGameTerminated()) return;
        
        let cell, tile;
        let vector = this.getVector(direction);
        let traversals = this.buildTraversals(vector);
        let moved = false;
        
        this.prepareTiles();
        
        traversals.x.forEach((x) => {
            traversals.y.forEach((y) => {
                cell = { x: x, y: y };
                tile = self.grid[x][y];
                
                if (tile) {
                    let positions = self.findFarthestPosition(cell, vector);
                    let next = self.grid[positions.next.x][positions.next.y];
                    
                    if (next && next.value === tile.value && !next.mergedFrom) {
                        let merged = { x: positions.next.x, y: positions.next.y, value: tile.value * 2 };
                        merged.mergedFrom = [tile, next];
                        
                        self.grid[cell.x][cell.y] = null;
                        self.grid[positions.next.x][positions.next.y] = merged;
                        
                        tile.updatePosition(positions.next);
                        
                        self.score += merged.value;
                        
                        if (merged.value === 2048) self.won = true;
                    } else {
                        self.moveTile(tile, positions.farthest);
                    }
                    
                    if (!self.positionsEqual(cell, tile)) {
                        moved = true;
                    }
                }
            });
        });
        
        if (moved) {
            this.addRandomTile();
            
            if (!this.movesAvailable()) {
                this.over = true;
            }
            
            this.actuate();
        }
    }
    
    getVector(direction) {
        let map = {
            0: { x: -1, y: 0 }, // Up
            1: { x: 0, y: 1 },  // Right
            2: { x: 1, y: 0 },  // Down
            3: { x: 0, y: -1 }  // Left
        };
        return map[direction];
    }
    
    buildTraversals(vector) {
        let traversals = { x: [], y: [] };
        
        for (let pos = 0; pos < this.size; pos++) {
            traversals.x.push(pos);
            traversals.y.push(pos);
        }
        
        if (vector.x === 1) traversals.x = traversals.x.reverse();
        if (vector.y === 1) traversals.y = traversals.y.reverse();
        
        return traversals;
    }
    
    findFarthestPosition(cell, vector) {
        let previous;
        
        do {
            previous = cell;
            cell = { x: previous.x + vector.x, y: previous.y + vector.y };
        } while (this.withinBounds(cell) && this.cellAvailable(cell));
        
        return {
            farthest: previous,
            next: cell
        };
    }
    
    withinBounds(position) {
        return position.x >= 0 && position.x < this.size &&
               position.y >= 0 && position.y < this.size;
    }
    
    cellAvailable(cell) {
        return !this.cellOccupied(cell);
    }
    
    cellOccupied(cell) {
        return !!this.grid[cell.x][cell.y];
    }
    
    moveTile(tile, cell) {
        this.grid[tile.x][tile.y] = null;
        this.grid[cell.x][cell.y] = tile;
        tile.updatePosition(cell);
    }
    
    prepareTiles() {
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                let tile = this.grid[x][y];
                if (tile) {
                    tile.mergedFrom = null;
                    tile.updatePosition = function(position) {
                        this.x = position.x;
                        this.y = position.y;
                    };
                }
            }
        }
    }
    
    positionsEqual(first, second) {
        return first.x === second.x && first.y === second.y;
    }
    
    movesAvailable() {
        return this.cellsAvailable() || this.tileMatchesAvailable();
    }
    
    cellsAvailable() {
        return !!this.availableCells().length;
    }
    
    tileMatchesAvailable() {
        let self = this;
        let tile;
        
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                tile = this.grid[x][y];
                
                if (tile) {
                    for (let direction = 0; direction < 4; direction++) {
                        let vector = self.getVector(direction);
                        let cell = { x: x + vector.x, y: y + vector.y };
                        let other = self.grid[cell.x] && self.grid[cell.x][cell.y];
                        
                        if (other && other.value === tile.value) {
                            return true;
                        }
                    }
                }
            }
        }
        
        return false;
    }
    
    isGameTerminated() {
        return this.over || (this.won && !this.keepPlaying);
    }
    
    actuate() {
        if (this.bestScore < this.score) {
            this.bestScore = this.score;
            localStorage.setItem('2048-best', this.bestScore);
        }
        
        this.clearContainer(this.tileContainer);
        
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                let tile = this.grid[x][y];
                if (tile) {
                    this.addTile(tile);
                }
            }
        }
        
        this.updateScore();
        
        if (this.over) {
            this.message(false);
        } else if (this.won && !this.keepPlaying) {
            this.message(true);
        }
    }
    
    clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
    
    addTile(tile) {
        let wrapper = document.createElement('div');
        let inner = document.createElement('div');
        let position = { x: tile.y, y: tile.x };
        let positionClass = 'tile-position-' + position.x + '-' + position.y;
        
        let classes = ['tile', 'tile-' + tile.value, positionClass];
        
        if (tile.value > 2048) classes.push('tile-super');
        
        this.applyClasses(wrapper, classes);
        
        inner.classList.add('tile-inner');
        inner.textContent = tile.value;
        
        if (tile.previousPosition) {
            let previousPosition = { x: tile.previousPosition.y, y: tile.previousPosition.x };
            let previousClass = 'tile-position-' + previousPosition.x + '-' + previousPosition.y;
            wrapper.classList.add(previousClass);
            
            window.requestAnimationFrame(() => {
                wrapper.classList.remove(previousClass);
                wrapper.classList.add(positionClass);
            });
        } else if (tile.mergedFrom) {
            classes.push('tile-merged');
            this.applyClasses(wrapper, classes);
            
            tile.mergedFrom.forEach((merged) => {
                this.addTile(merged);
            });
        } else {
            classes.push('tile-new');
            this.applyClasses(wrapper, classes);
        }
        
        wrapper.appendChild(inner);
        this.tileContainer.appendChild(wrapper);
        
        // Position the tile
        let cellSize = window.innerWidth <= 520 ? 62.5 : 107.5;
        let padding = window.innerWidth <= 520 ? 5 : 10;
        
        wrapper.style.position = 'absolute';
        wrapper.style.left = (position.x * (cellSize + padding) + padding) + 'px';
        wrapper.style.top = (position.y * (cellSize + padding) + padding) + 'px';
    }
    
    applyClasses(element, classes) {
        element.className = classes.join(' ');
    }
    
    updateScore() {
        this.clearContainer(this.scoreContainer);
        this.scoreContainer.appendChild(document.createTextNode(this.score));
        
        this.clearContainer(this.bestContainer);
        this.bestContainer.appendChild(document.createTextNode(this.bestScore));
    }
    
    message(won) {
        let type = won ? 'game-won' : 'game-over';
        let message = won ? '你赢了!' : '游戏结束!';
        
        this.messageContainer.classList.add(type);
        this.messageContainer.getElementsByTagName('p')[0].textContent = message;
        this.messageContainer.style.display = 'block';
        
        if (won && !this.keepPlaying) {
            this.messageContainer.getElementsByTagName('button')[0].addEventListener('click', () => {
                this.keepPlaying = true;
                this.clearMessage();
            });
        }
    }
    
    clearMessage() {
        this.messageContainer.classList.remove('game-won');
        this.messageContainer.classList.remove('game-over');
        this.messageContainer.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});