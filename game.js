// Game.js - Core game logic, state management, and match-3 mechanics

class Game {
    constructor() {
        this.COLS = 10;
        this.ROWS = 20;
        this.CELL_SIZE = 30;
        
        // Game state
        this.grid = this.createGrid();
        this.currentPiece = null;
        this.nextPiece = null;
        this.holdPiece = null;
        this.canHold = true;
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.combo = 0;
        this.highScore = parseInt(localStorage.getItem('chromacascade_highscore')) || 0;
        this.gameOver = false;
        this.paused = false;
        this.startTime = Date.now();
        
        // Game timing
        this.lastMoveDown = 0;
        this.moveDownInterval = 1000; // 1 second initially
        this.lockDelay = 500; // Grace period before locking
        this.lockTimer = null;
        
        // Animation state
        this.clearingBlocks = [];
        this.cascading = false;
        this.particles = [];
    }

    createGrid() {
        const grid = [];
        for (let row = 0; row < this.ROWS; row++) {
            grid[row] = [];
            for (let col = 0; col < this.COLS; col++) {
                grid[row][col] = null; // null = empty, otherwise stores color
            }
        }
        return grid;
    }

    start() {
        this.currentPiece = new Tetromino(null, this.getColorCount());
        this.nextPiece = new Tetromino(null, this.getColorCount());
        this.startTime = Date.now();
        this.gameOver = false;
        this.paused = false;
    }

    getColorCount() {
        // Increase color complexity based on level
        if (this.level <= 3) return 4;
        if (this.level <= 7) return 5;
        if (this.level <= 12) return 6;
        return 7;
    }

    getMoveDownInterval() {
        // Speed increases with level
        const baseInterval = 1000;
        if (this.level <= 5) {
            return baseInterval - (this.level - 1) * 100;
        } else if (this.level <= 10) {
            return 600 - (this.level - 6) * 50;
        } else {
            return Math.max(100, 350 - (this.level - 11) * 25);
        }
    }

    update(deltaTime) {
        if (this.gameOver || this.paused || this.cascading) return;

        this.lastMoveDown += deltaTime;
        const interval = this.getMoveDownInterval();

        if (this.lastMoveDown >= interval) {
            this.moveDown();
            this.lastMoveDown = 0;
        }

        // Update particles
        this.particles = this.particles.filter(p => {
            p.update();
            return p.life > 0;
        });
    }

    moveLeft() {
        if (this.gameOver || this.paused || this.cascading) return;
        this.currentPiece.x--;
        if (this.checkCollision()) {
            this.currentPiece.x++;
        }
    }

    moveRight() {
        if (this.gameOver || this.paused || this.cascading) return;
        this.currentPiece.x++;
        if (this.checkCollision()) {
            this.currentPiece.x--;
        }
    }

    moveDown() {
        if (this.gameOver || this.paused || this.cascading) return;
        
        this.currentPiece.y++;
        if (this.checkCollision()) {
            this.currentPiece.y--;
            this.lockPiece();
            return false;
        }
        return true;
    }

    rotate(clockwise = true) {
        if (this.gameOver || this.paused || this.cascading) return;
        
        const rotated = this.currentPiece.rotate(clockwise);
        const originalShape = this.currentPiece.shape;
        const originalColors = this.currentPiece.colors;
        
        this.currentPiece.applyRotation(rotated);
        
        // Wall kick attempts
        const kicks = [
            { x: 0, y: 0 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: -2, y: 0 },
            { x: 2, y: 0 }
        ];
        
        let success = false;
        for (const kick of kicks) {
            this.currentPiece.x += kick.x;
            this.currentPiece.y += kick.y;
            
            if (!this.checkCollision()) {
                success = true;
                break;
            }
            
            this.currentPiece.x -= kick.x;
            this.currentPiece.y -= kick.y;
        }
        
        if (!success) {
            this.currentPiece.shape = originalShape;
            this.currentPiece.colors = originalColors;
        }
    }

    hardDrop() {
        if (this.gameOver || this.paused || this.cascading) return;
        
        let dropDistance = 0;
        while (!this.checkCollision()) {
            this.currentPiece.y++;
            dropDistance++;
        }
        this.currentPiece.y--;
        dropDistance--;
        
        this.score += dropDistance; // 1 point per cell dropped
        this.lockPiece();
    }

    softDrop() {
        if (this.gameOver || this.paused || this.cascading) return;
        
        if (this.moveDown()) {
            this.score += 1;
        }
    }

    holdCurrentPiece() {
        if (this.gameOver || this.paused || this.cascading || !this.canHold) return;
        
        if (this.holdPiece === null) {
            this.holdPiece = new Tetromino(this.currentPiece.type, this.getColorCount());
            this.spawnNextPiece();
        } else {
            const temp = this.holdPiece;
            this.holdPiece = new Tetromino(this.currentPiece.type, this.getColorCount());
            this.currentPiece = new Tetromino(temp.type, this.getColorCount());
        }
        
        this.canHold = false;
    }

    checkCollision() {
        const blocks = this.currentPiece.getBlocks();
        
        for (const block of blocks) {
            // Check boundaries
            if (block.x < 0 || block.x >= this.COLS || block.y >= this.ROWS) {
                return true;
            }
            
            // Check grid collision (but not if above the grid)
            if (block.y >= 0 && this.grid[block.y][block.x] !== null) {
                return true;
            }
        }
        
        return false;
    }

    lockPiece() {
        const blocks = this.currentPiece.getBlocks();
        
        // Add blocks to grid
        for (const block of blocks) {
            if (block.y >= 0) {
                this.grid[block.y][block.x] = block.color;
            }
        }
        
        // Check for game over
        if (blocks.some(b => b.y < 0)) {
            this.gameOver = true;
            this.updateHighScore();
            return;
        }
        
        // Process matches and cascades
        this.processMatches();
        
        this.canHold = true;
    }

    async processMatches() {
        this.cascading = true;
        let cascadeLevel = 0;
        let totalLinesCleared = 0;
        
        while (true) {
            // Find matches
            const matches = this.findMatches();
            const lineClearCount = this.checkLineClears();
            
            if (matches.length === 0 && lineClearCount === 0) {
                break;
            }
            
            cascadeLevel++;
            
            // Clear matched blocks
            if (matches.length > 0) {
                this.clearMatches(matches, cascadeLevel);
                await this.sleep(300);
            }
            
            // Clear complete lines
            if (lineClearCount > 0) {
                this.clearLines();
                totalLinesCleared += lineClearCount;
                this.scoreLineClears(lineClearCount);
            }
            
            // Apply gravity
            this.applyGravity();
            await this.sleep(200);
        }
        
        // Update combo
        if (cascadeLevel > 0) {
            this.combo++;
            if (this.combo > 1) {
                const comboBonus = 50 * this.combo;
                this.score += comboBonus;
                this.showScorePopup(`COMBO x${this.combo}`, comboBonus);
            }
        } else {
            this.combo = 0;
        }
        
        // Update lines and level
        if (totalLinesCleared > 0) {
            this.lines += totalLinesCleared;
            this.checkLevelUp();
        }
        
        this.cascading = false;
        this.spawnNextPiece();
    }

    findMatches() {
        const matches = new Set();
        
        // Check horizontal matches
        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS - 2; col++) {
                const color = this.grid[row][col];
                if (color === null) continue;
                
                let matchLength = 1;
                while (col + matchLength < this.COLS && this.grid[row][col + matchLength] === color) {
                    matchLength++;
                }
                
                if (matchLength >= 3) {
                    for (let i = 0; i < matchLength; i++) {
                        matches.add(`${row},${col + i}`);
                    }
                }
            }
        }
        
        // Check vertical matches
        for (let col = 0; col < this.COLS; col++) {
            for (let row = 0; row < this.ROWS - 2; row++) {
                const color = this.grid[row][col];
                if (color === null) continue;
                
                let matchLength = 1;
                while (row + matchLength < this.ROWS && this.grid[row + matchLength][col] === color) {
                    matchLength++;
                }
                
                if (matchLength >= 3) {
                    for (let i = 0; i < matchLength; i++) {
                        matches.add(`${row + i},${col}`);
                    }
                }
            }
        }
        
        return Array.from(matches).map(coord => {
            const [row, col] = coord.split(',').map(Number);
            return { row, col, color: this.grid[row][col] };
        });
    }

    checkLineClears() {
        let count = 0;
        for (let row = 0; row < this.ROWS; row++) {
            if (this.grid[row].every(cell => cell !== null)) {
                count++;
            }
        }
        return count;
    }

    clearMatches(matches, cascadeLevel) {
        const matchSize = matches.length;
        let basePoints = 0;
        
        // Calculate base points
        if (matchSize === 3) basePoints = 100;
        else if (matchSize === 4) basePoints = 250;
        else if (matchSize === 5) basePoints = 500;
        else basePoints = 1000 + (matchSize - 6) * 200;
        
        // Apply cascade multiplier
        const points = basePoints * cascadeLevel;
        this.score += points;
        
        // Create particles
        for (const match of matches) {
            this.createParticles(match.col, match.row, match.color);
            this.grid[match.row][match.col] = null;
        }
        
        this.showScorePopup(`+${points}`, points);
    }

    clearLines() {
        for (let row = this.ROWS - 1; row >= 0; row--) {
            if (this.grid[row].every(cell => cell !== null)) {
                this.grid.splice(row, 1);
                this.grid.unshift(Array(this.COLS).fill(null));
                row++; // Recheck this row
            }
        }
    }

    scoreLineClears(count) {
        const points = [0, 100, 300, 500, 800];
        const earned = points[Math.min(count, 4)];
        this.score += earned;
    }

    applyGravity() {
        for (let col = 0; col < this.COLS; col++) {
            let writeRow = this.ROWS - 1;
            
            for (let row = this.ROWS - 1; row >= 0; row--) {
                if (this.grid[row][col] !== null) {
                    if (row !== writeRow) {
                        this.grid[writeRow][col] = this.grid[row][col];
                        this.grid[row][col] = null;
                    }
                    writeRow--;
                }
            }
        }
    }

    checkLevelUp() {
        const newLevel = Math.floor(this.lines / 10) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
        }
    }

    spawnNextPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = new Tetromino(null, this.getColorCount());
        
        if (this.checkCollision()) {
            this.gameOver = true;
            this.updateHighScore();
        }
    }

    getGhostPiece() {
        if (!this.currentPiece) return null;
        
        const ghost = this.currentPiece.clone();
        while (true) {
            ghost.y++;
            const blocks = ghost.getBlocks();
            let collision = false;
            
            for (const block of blocks) {
                if (block.y >= this.ROWS || 
                    (block.y >= 0 && this.grid[block.y][block.x] !== null)) {
                    collision = true;
                    break;
                }
            }
            
            if (collision) {
                ghost.y--;
                break;
            }
        }
        
        return ghost;
    }

    createParticles(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    showScorePopup(text, points) {
        // This will be called by renderer
        if (window.renderer) {
            window.renderer.createScorePopup(text, points);
        }
    }

    updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('chromacascade_highscore', this.highScore);
        }
    }

    getElapsedTime() {
        if (this.gameOver) return this.elapsedTime || 0;
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    reset() {
        this.grid = this.createGrid();
        this.currentPiece = null;
        this.nextPiece = null;
        this.holdPiece = null;
        this.canHold = true;
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.combo = 0;
        this.gameOver = false;
        this.paused = false;
        this.particles = [];
        this.cascading = false;
        this.lastMoveDown = 0;
        this.start();
    }

    togglePause() {
        if (this.gameOver) return;
        this.paused = !this.paused;
    }
}

// Particle class for visual effects
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 1.0;
        this.decay = 0.02;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // Gravity
        this.life -= this.decay;
    }
}
