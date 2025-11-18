// Tetromino.js - Defines all piece shapes and color logic

const COLORS = [
    '#FF006E', // Hot Pink
    '#3A86FF', // Electric Blue
    '#06FFA5', // Neon Green
    '#FFBE0B', // Cyber Yellow
    '#FF5A00', // Vivid Orange
    '#8338EC', // Royal Purple
    '#FF0054'  // Crimson Red
];

// Standard Tetris piece shapes (each piece is 4x4 grid)
const SHAPES = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    O: [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    T: [
        [0, 0, 0, 0],
        [0, 1, 1, 1],
        [0, 0, 1, 0],
        [0, 0, 0, 0]
    ],
    L: [
        [0, 0, 0, 0],
        [0, 1, 1, 1],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ],
    J: [
        [0, 0, 0, 0],
        [0, 1, 1, 1],
        [0, 0, 0, 1],
        [0, 0, 0, 0]
    ],
    S: [
        [0, 0, 0, 0],
        [0, 0, 1, 1],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    Z: [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0]
    ]
};

const PIECE_TYPES = Object.keys(SHAPES);

class Tetromino {
    constructor(type = null, colorLevel = 4) {
        this.type = type || PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
        this.shape = JSON.parse(JSON.stringify(SHAPES[this.type])); // Deep copy
        this.colorLevel = colorLevel; // Number of colors available
        this.colors = this.generateColors();
        this.x = 3; // Start position (centered in 10-wide grid)
        this.y = 0;
    }

    generateColors() {
        // Create a color map for each cell in the piece
        const colorMap = [];
        const availableColors = COLORS.slice(0, this.colorLevel);
        
        for (let row = 0; row < 4; row++) {
            colorMap[row] = [];
            for (let col = 0; col < 4; col++) {
                if (this.shape[row][col] === 1) {
                    // Assign random color to each block
                    colorMap[row][col] = availableColors[Math.floor(Math.random() * availableColors.length)];
                } else {
                    colorMap[row][col] = null;
                }
            }
        }
        
        return colorMap;
    }

    rotate(clockwise = true) {
        const n = this.shape.length;
        const rotated = Array(n).fill(0).map(() => Array(n).fill(0));
        const rotatedColors = Array(n).fill(0).map(() => Array(n).fill(null));

        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                if (clockwise) {
                    rotated[col][n - 1 - row] = this.shape[row][col];
                    rotatedColors[col][n - 1 - row] = this.colors[row][col];
                } else {
                    rotated[n - 1 - col][row] = this.shape[row][col];
                    rotatedColors[n - 1 - col][row] = this.colors[row][col];
                }
            }
        }

        return { shape: rotated, colors: rotatedColors };
    }

    applyRotation(rotated) {
        this.shape = rotated.shape;
        this.colors = rotated.colors;
    }

    getBlocks() {
        // Returns array of {x, y, color} for all filled cells
        const blocks = [];
        for (let row = 0; row < this.shape.length; row++) {
            for (let col = 0; col < this.shape[row].length; col++) {
                if (this.shape[row][col] === 1) {
                    blocks.push({
                        x: this.x + col,
                        y: this.y + row,
                        color: this.colors[row][col]
                    });
                }
            }
        }
        return blocks;
    }

    clone() {
        const cloned = new Tetromino(this.type, this.colorLevel);
        cloned.shape = JSON.parse(JSON.stringify(this.shape));
        cloned.colors = JSON.parse(JSON.stringify(this.colors));
        cloned.x = this.x;
        cloned.y = this.y;
        return cloned;
    }
}
