# ChromaCascade 🎮

A modern block-dropping puzzle game that merges the strategic placement of Tetris with the color-matching cascade mechanics of Candy Crush.

![Game Screenshot](https://img.shields.io/badge/Status-Playable-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)

## 🎯 Game Overview

ChromaCascade features:
- **Dual-Attribute Blocks**: Each cell in a Tetromino has its own color
- **Match-3 Mechanics**: Match 3+ blocks of the same color horizontally or vertically
- **Cascade System**: Chain reactions create powerful combos and multipliers
- **Progressive Difficulty**: Speed increases and more colors unlock as you level up
- **Modern Neon Aesthetic**: Sleek design with glowing effects and smooth animations

## 🕹️ How to Play

1. Open `index.html` in any modern web browser
2. Use the controls to drop and place blocks
3. Match 3+ blocks of the same color to clear them
4. Create cascades for bonus points and multipliers!

### Controls

| Action | Keys |
|--------|------|
| **Move Left** | ← or A |
| **Move Right** | → or D |
| **Rotate Clockwise** | ↑ or W |
| **Rotate Counter-Clockwise** | Z or Q |
| **Soft Drop** | ↓ or S |
| **Hard Drop** | Spacebar or Enter |
| **Hold Piece** | C or Shift |
| **Pause** | ESC or P |

## 🎮 Gameplay Features

### Scoring System
- **3-Block Match**: 100 points
- **4-Block Match**: 250 points
- **5-Block Match**: 500 points
- **6+ Block Match**: 1,000+ points
- **Cascade Multiplier**: Up to 4x for consecutive cascades
- **Combo Bonus**: +50 points per combo level

### Progression
- Advance one level every 10 lines cleared or 2,000 points
- Fall speed increases with each level
- Color complexity grows from 4 colors (Level 1-3) to 7 colors (Level 13+)
- Blocks become more color-varied at higher levels

## 📁 Project Structure

```
GitHubCopilotGameCreation/
├── index.html              # Main HTML structure
├── styles.css              # Modern neon styling and animations
├── tetromino.js            # Piece definitions and color generation
├── game.js                 # Core game logic and match-3 mechanics
├── renderer.js             # Canvas rendering and visual effects
├── main.js                 # Game initialization and input handling
└── GameDesignDocument.md   # Complete design specification
```

## 🚀 Quick Start

No installation required! Just:

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start playing!

```bash
git clone https://github.com/Gokul7112000/TestForGitHubCopilot.git
cd TestForGitHubCopilot
# Open index.html in your browser
```

## 🎨 Technical Details

- **Pure Vanilla JavaScript** - No frameworks or dependencies
- **HTML5 Canvas** - Hardware-accelerated rendering
- **Responsive Design** - Works on various screen sizes
- **LocalStorage** - Persistent high score tracking
- **60 FPS Gameplay** - Smooth animations and particle effects

## 🏆 Game Modes

- **Endless Mode**: Play until the blocks reach the top - aim for the highest score!
- Progressive difficulty scaling keeps the challenge fresh
- High score tracking across sessions

## 📖 Design Philosophy

ChromaCascade combines the best of two puzzle game genres:

1. **Strategic Planning** (Tetris): Where should I place this piece?
2. **Pattern Recognition** (Match-3): Which colors can I match?
3. **Emergent Complexity**: The interaction creates deeper strategy than either game alone

## 🛠️ Development

Built with:
- HTML5 Canvas API
- ES6 JavaScript (Classes, Promises, Async/Await)
- CSS3 Animations & Gradients
- LocalStorage API

## 📄 License

Created as an educational project demonstrating game development concepts.

## 🎯 Future Enhancements

Potential features for future versions:
- Marathon mode (150 lines to win)
- Power-ups and special blocks
- Colorblind accessibility mode
- Sound effects and background music
- Online leaderboards
- Mobile touch controls

## 👨‍💻 Credits

Designed and developed as a hybrid puzzle game concept, merging classic mechanics into a fresh gaming experience.

---

**Enjoy playing ChromaCascade!** Drop blocks, match colors, and master the cascade! 🌈✨
