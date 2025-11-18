// Renderer.js - Handles all canvas rendering and visual effects

class Renderer {
    constructor(game) {
        this.game = game;
        
        // Canvas elements
        this.gameCanvas = document.getElementById('gameCanvas');
        this.gameCtx = this.gameCanvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        this.holdCanvas = document.getElementById('holdCanvas');
        this.holdCtx = this.holdCanvas.getContext('2d');
        
        // Display elements
        this.scoreValue = document.getElementById('scoreValue');
        this.levelValue = document.getElementById('levelValue');
        this.linesValue = document.getElementById('linesValue');
        this.comboValue = document.getElementById('comboValue');
        this.highScoreValue = document.getElementById('highScoreValue');
        this.timeValue = document.getElementById('timeValue');
        this.scoreNotifications = document.getElementById('scoreNotifications');
        
        this.CELL_SIZE = 30;
    }

    render() {
        this.renderGameBoard();
        this.renderNextPiece();
        this.renderHoldPiece();
        this.updateUI();
    }

    renderGameBoard() {
        const ctx = this.gameCtx;
        const cellSize = this.CELL_SIZE;
        
        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        
        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let row = 0; row <= this.game.ROWS; row++) {
            ctx.beginPath();
            ctx.moveTo(0, row * cellSize);
            ctx.lineTo(this.game.COLS * cellSize, row * cellSize);
            ctx.stroke();
        }
        for (let col = 0; col <= this.game.COLS; col++) {
            ctx.beginPath();
            ctx.moveTo(col * cellSize, 0);
            ctx.lineTo(col * cellSize, this.game.ROWS * cellSize);
            ctx.stroke();
        }
        
        // Draw placed blocks
        for (let row = 0; row < this.game.ROWS; row++) {
            for (let col = 0; col < this.game.COLS; col++) {
                if (this.game.grid[row][col] !== null) {
                    this.drawBlock(ctx, col, row, this.game.grid[row][col], 1.0);
                }
            }
        }
        
        // Draw ghost piece
        if (this.game.currentPiece && !this.game.gameOver) {
            const ghost = this.game.getGhostPiece();
            if (ghost) {
                const blocks = ghost.getBlocks();
                for (const block of blocks) {
                    if (block.y >= 0) {
                        this.drawBlock(ctx, block.x, block.y, block.color, 0.15);
                    }
                }
            }
        }
        
        // Draw current piece
        if (this.game.currentPiece && !this.game.gameOver) {
            const blocks = this.game.currentPiece.getBlocks();
            for (const block of blocks) {
                if (block.y >= 0) {
                    this.drawBlock(ctx, block.x, block.y, block.color, 1.0);
                }
            }
        }
        
        // Draw danger zone indicator
        if (!this.game.gameOver) {
            for (let row = 0; row < 2; row++) {
                for (let col = 0; col < this.game.COLS; col++) {
                    if (this.game.grid[row][col] !== null) {
                        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
                    }
                }
            }
        }
        
        // Draw particles
        for (const particle of this.game.particles) {
            this.drawParticle(ctx, particle);
        }
    }

    drawBlock(ctx, x, y, color, alpha = 1.0) {
        const cellSize = this.CELL_SIZE;
        const px = x * cellSize;
        const py = y * cellSize;
        
        // Main block color
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
        
        // Highlight (top-left)
        const gradient = ctx.createLinearGradient(px, py, px + cellSize, py + cellSize);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
        ctx.fillStyle = gradient;
        ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
        
        // Glow effect
        if (alpha > 0.5) {
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.strokeRect(px + 2, py + 2, cellSize - 4, cellSize - 4);
            ctx.shadowBlur = 0;
        }
        
        ctx.globalAlpha = 1.0;
    }

    drawParticle(ctx, particle) {
        const cellSize = this.CELL_SIZE;
        const px = (particle.x + 0.5) * cellSize;
        const py = (particle.y + 0.5) * cellSize;
        const size = 4 * particle.life;
        
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life;
        ctx.fillRect(px - size / 2, py - size / 2, size, size);
        ctx.globalAlpha = 1.0;
    }

    renderNextPiece() {
        const ctx = this.nextCtx;
        const cellSize = 25;
        
        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (this.game.nextPiece) {
            const piece = this.game.nextPiece;
            const offsetX = (this.nextCanvas.width - 4 * cellSize) / 2;
            const offsetY = (this.nextCanvas.height - 4 * cellSize) / 2;
            
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    if (piece.shape[row][col] === 1) {
                        const px = offsetX + col * cellSize;
                        const py = offsetY + row * cellSize;
                        
                        ctx.fillStyle = piece.colors[row][col];
                        ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
                        
                        // Small glow
                        ctx.shadowColor = piece.colors[row][col];
                        ctx.shadowBlur = 5;
                        ctx.strokeStyle = piece.colors[row][col];
                        ctx.lineWidth = 1;
                        ctx.strokeRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
                        ctx.shadowBlur = 0;
                    }
                }
            }
        }
    }

    renderHoldPiece() {
        const ctx = this.holdCtx;
        const cellSize = 25;
        
        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, this.holdCanvas.width, this.holdCanvas.height);
        
        if (this.game.holdPiece) {
            const piece = this.game.holdPiece;
            const offsetX = (this.holdCanvas.width - 4 * cellSize) / 2;
            const offsetY = (this.holdCanvas.height - 4 * cellSize) / 2;
            
            const alpha = this.game.canHold ? 1.0 : 0.3;
            
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    if (piece.shape[row][col] === 1) {
                        const px = offsetX + col * cellSize;
                        const py = offsetY + row * cellSize;
                        
                        ctx.globalAlpha = alpha;
                        ctx.fillStyle = piece.colors[row][col];
                        ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
                        
                        // Small glow
                        ctx.shadowColor = piece.colors[row][col];
                        ctx.shadowBlur = 5;
                        ctx.strokeStyle = piece.colors[row][col];
                        ctx.lineWidth = 1;
                        ctx.strokeRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
                        ctx.shadowBlur = 0;
                        ctx.globalAlpha = 1.0;
                    }
                }
            }
        }
    }

    updateUI() {
        this.scoreValue.textContent = this.game.score.toLocaleString();
        this.levelValue.textContent = this.game.level;
        this.linesValue.textContent = this.game.lines;
        this.comboValue.textContent = this.game.combo;
        this.highScoreValue.textContent = this.game.highScore.toLocaleString();
        
        // Update time
        const elapsed = this.game.getElapsedTime();
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        this.timeValue.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Animate score when it changes
        if (this.lastScore !== this.game.score) {
            this.scoreValue.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.scoreValue.style.transform = 'scale(1)';
            }, 200);
            this.lastScore = this.game.score;
        }
    }

    createScorePopup(text, points) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = text;
        
        // Position at center of game board
        const rect = this.gameCanvas.getBoundingClientRect();
        popup.style.left = `${rect.left + rect.width / 2}px`;
        popup.style.top = `${rect.top + rect.height / 2}px`;
        
        this.scoreNotifications.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }

    showGameOver() {
        document.getElementById('gameOverScreen').classList.remove('hidden');
        document.getElementById('finalScore').textContent = this.game.score.toLocaleString();
        document.getElementById('finalLevel').textContent = this.game.level;
    }

    hideGameOver() {
        document.getElementById('gameOverScreen').classList.add('hidden');
    }

    showPause() {
        document.getElementById('pauseScreen').classList.remove('hidden');
    }

    hidePause() {
        document.getElementById('pauseScreen').classList.add('hidden');
    }
}
