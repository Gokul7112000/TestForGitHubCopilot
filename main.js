// Main.js - Initialize game and handle input

let game;
let renderer;
let lastTime = 0;
let keys = {};

// Key mapping
const KEY_LEFT = ['ArrowLeft', 'a', 'A'];
const KEY_RIGHT = ['ArrowRight', 'd', 'D'];
const KEY_DOWN = ['ArrowDown', 's', 'S'];
const KEY_UP = ['ArrowUp', 'w', 'W'];
const KEY_ROTATE_CCW = ['z', 'Z', 'q', 'Q'];
const KEY_HARD_DROP = [' ', 'Enter'];
const KEY_HOLD = ['c', 'C', 'Shift'];
const KEY_PAUSE = ['Escape', 'p', 'P'];

// Input handling
let moveLeftInterval = null;
let moveRightInterval = null;
let softDropInterval = null;

function init() {
    game = new Game();
    renderer = new Renderer(game);
    window.renderer = renderer; // Make renderer available globally for game.js
    
    game.start();
    
    setupEventListeners();
    gameLoop(0);
}

function setupEventListeners() {
    // Keyboard input
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Restart button
    document.getElementById('restartButton').addEventListener('click', () => {
        game.reset();
        renderer.hideGameOver();
    });
    
    // Prevent scrolling with arrow keys
    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
    });
}

function handleKeyDown(e) {
    if (keys[e.key]) return; // Prevent key repeat
    keys[e.key] = true;
    
    // Movement
    if (KEY_LEFT.includes(e.key)) {
        game.moveLeft();
        clearInterval(moveLeftInterval);
        moveLeftInterval = setInterval(() => game.moveLeft(), 100);
    }
    
    if (KEY_RIGHT.includes(e.key)) {
        game.moveRight();
        clearInterval(moveRightInterval);
        moveRightInterval = setInterval(() => game.moveRight(), 100);
    }
    
    if (KEY_DOWN.includes(e.key)) {
        game.softDrop();
        clearInterval(softDropInterval);
        softDropInterval = setInterval(() => game.softDrop(), 50);
    }
    
    // Rotation
    if (KEY_UP.includes(e.key)) {
        game.rotate(true); // Clockwise
    }
    
    if (KEY_ROTATE_CCW.includes(e.key)) {
        game.rotate(false); // Counter-clockwise
    }
    
    // Hard drop
    if (KEY_HARD_DROP.includes(e.key)) {
        game.hardDrop();
    }
    
    // Hold
    if (KEY_HOLD.includes(e.key)) {
        game.holdCurrentPiece();
    }
    
    // Pause
    if (KEY_PAUSE.includes(e.key)) {
        game.togglePause();
        if (game.paused) {
            renderer.showPause();
        } else {
            renderer.hidePause();
        }
    }
}

function handleKeyUp(e) {
    keys[e.key] = false;
    
    // Stop auto-repeat for movement keys
    if (KEY_LEFT.includes(e.key)) {
        clearInterval(moveLeftInterval);
        moveLeftInterval = null;
    }
    
    if (KEY_RIGHT.includes(e.key)) {
        clearInterval(moveRightInterval);
        moveRightInterval = null;
    }
    
    if (KEY_DOWN.includes(e.key)) {
        clearInterval(softDropInterval);
        softDropInterval = null;
    }
}

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    // Update game state
    game.update(deltaTime);
    
    // Render
    renderer.render();
    
    // Check game over
    if (game.gameOver && !document.getElementById('gameOverScreen').classList.contains('hidden') === false) {
        renderer.showGameOver();
    }
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Start game when page loads
window.addEventListener('load', init);
