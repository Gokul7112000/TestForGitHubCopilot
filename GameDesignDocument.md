# ChromaCascade: Game Design Document

**Version:** 1.0  
**Date:** November 18, 2025  
**Platform:** Desktop Application (Windows/Mac/Linux)  
**Genre:** Hybrid Puzzle - Block Placement + Match-3

---

## 1. Game Title

**ChromaCascade**

*Tagline: "Drop the blocks. Match the colors. Master the cascade."*

---

## 2. Core Gameplay Loop

### Block Falling Mechanics

- **Tetromino-style blocks** (classic 4-block shapes: I, O, T, L, J, S, Z) fall from the top center of the playfield at regular intervals.
- Each block descends one row per time interval (initial speed: 1 second per row).
- Blocks have **dual attributes**:
  - **Shape:** Standard Tetris geometries (I-piece, L-piece, etc.)
  - **Color:** Each individual cell within a Tetromino has one of 5-7 colors (Red, Blue, Green, Yellow, Purple, Orange, Pink).
- Blocks are **not monochromatic** - each cell in a Tetromino can have a different color, creating strategic placement opportunities.

### Placement and Interaction

- When a falling block touches another block or the bottom of the playfield, it **locks in place** after a brief grace period (0.5 seconds).
- Locked blocks become part of the static playfield grid.
- The Tetromino shape determines initial placement, but the color of individual cells is what matters for matching.

### Match-3 Color-Clearing Mechanism

**Matching Rules:**
- When **3 or more blocks of the same color** are adjacent (horizontally or vertically, NOT diagonally), they form a valid match.
- Valid matches must be in a continuous line (horizontal or vertical).
- Matches are detected immediately after a block locks into place.

**Clearing Sequence:**
1. All matched blocks **disappear simultaneously** with a satisfying visual effect (particle burst, color flash).
2. Blocks above the cleared spaces immediately **fall downward** to fill empty cells (gravity effect).
3. New matches formed by falling blocks are detected automatically, triggering **cascades**.
4. Cascades continue until no new matches are created.
5. During cascades, no new blocks spawn from the top.

**Special Matching Rules:**
- **Line Clear Bonus:** If an entire horizontal row is filled (Tetris-style) AND contains a match-3, both bonuses apply.
- **Multi-Color Matches:** Matching 4+ blocks of the same color creates enhanced effects and bonus points.
- **Cross Patterns:** Simultaneous horizontal + vertical matches of the same color create combo multipliers.

### Block Spawning

- A new Tetromino spawns at the top center of the playfield immediately after the previous block locks AND all cascade effects complete.
- **Next Block Preview:** Players can see the upcoming block (shape and colors) in a preview window.
- **Hold Function:** Players can store one block in a "hold" slot and swap it with the current falling block (once per block).

---

## 3. Player Controls

### Keyboard Layout (Desktop)

| Action | Primary Key | Alternative Key |
|--------|-------------|-----------------|
| **Move Left** | Left Arrow (←) | A |
| **Move Right** | Right Arrow (→) | D |
| **Rotate Clockwise** | Up Arrow (↑) | W |
| **Rotate Counter-Clockwise** | Z | Q |
| **Soft Drop** (accelerate fall) | Down Arrow (↓) | S |
| **Hard Drop** (instant placement) | Spacebar | Enter |
| **Hold Block** | C | Shift |
| **Pause Game** | Esc | P |

### Control Behavior

- **Responsive Movement:** Left/right movement has minimal delay (50ms) with auto-repeat when held.
- **Rotation System:** Standard Rotation System (SRS) with wall kicks for smoother rotation near edges.
- **Hard Drop:** Instantly drops the block to the lowest valid position and locks it immediately (no grace period).
- **Soft Drop:** Increases fall speed by 10x while key is held; awards 1 point per cell dropped.

---

## 4. Scoring System

### Base Points

| Action | Points |
|--------|--------|
| **3-Block Match** | 100 points |
| **4-Block Match** | 250 points |
| **5-Block Match** | 500 points |
| **6+ Block Match** | 1,000 points + 200 per additional block |
| **Single Line Clear** (no match) | 100 points |
| **Double Line Clear** | 300 points |
| **Triple Line Clear** | 500 points |
| **Quadruple Line Clear** (Tetris) | 800 points |

### Multipliers and Bonuses

- **Cascade Multiplier:** Each cascade level multiplies the base match score.
  - 1st cascade: 1x (normal)
  - 2nd cascade: 2x
  - 3rd cascade: 3x
  - 4th+ cascade: 4x (maximum)
  
- **Combo Bonus:** Consecutive block placements that create matches without breaking the chain.
  - Combo counter increases by 1 for each successful match.
  - Bonus: +50 points × combo level (e.g., 5-combo = +250 points).
  - Combo breaks if a placement creates no matches.

- **Perfect Clear Bonus:** Clearing the entire playfield = 5,000 points.

- **Color Specialist Bonus:** Matching the same color 5 times in a row = +500 points.

### Score Display

- Current score displayed prominently in the UI.
- Points earned from each action appear as floating text at the match location.
- Total session high score tracked and displayed.

---

## 5. Game Progression/Levels

### Difficulty Scaling

**Level Advancement:**
- Players advance one level for every **10 line clears** OR every **2,000 points** (whichever comes first).
- Level displayed prominently in the UI.

**Speed Increase:**
- **Level 1:** 1 block per second
- **Level 2-5:** -100ms per level (0.9s, 0.8s, 0.7s, 0.6s)
- **Level 6-10:** -50ms per level
- **Level 11+:** -25ms per level (minimum: 100ms at level 30+)

**Color Complexity:**
- **Levels 1-3:** 4 colors (easier matching)
- **Levels 4-7:** 5 colors
- **Levels 8-12:** 6 colors
- **Levels 13+:** 7 colors (maximum difficulty)

**Block Variety:**
- **Levels 1-5:** Standard 7 Tetrominoes, moderate color mixing within pieces
- **Levels 6-10:** Increased color variation within single pieces (harder to plan matches)
- **Levels 11+:** Introduction of "rainbow blocks" that can match any color (rare spawn, 5% chance)

### Game Modes

**Endless Mode (Primary):**
- No win condition - play until game over.
- Continuous level scaling.
- Global leaderboard integration.

**Marathon Mode (Optional):**
- Clear 150 lines to win.
- Fixed difficulty curve.
- Time-based scoring bonus.

---

## 6. Win/Loss Conditions

### Loss Condition

**Game Over** occurs when:
- A newly spawned block **cannot fit** in the playfield (top row is blocked).
- "Danger Zone" (top 2 rows) triggers visual warnings when occupied.
- Players receive a 5-second warning when the playfield reaches critical height.

### Win Conditions

**Endless Mode:**
- No traditional win - goal is highest score/level achieved.
- Personal best tracking and leaderboards provide achievement motivation.

**Marathon Mode:**
- Successfully clear 150 lines without game over.
- Victory bonus: 10,000 points + remaining time bonus (100 points per second).

---

## 7. User Interface (UI) Elements

### Main Game Screen Layout

```
┌─────────────────────────────────────────────────┐
│  LEVEL: 5        CHROMACASCADE        SCORE: 8,750  │
├──────────┬───────────────────────────┬──────────┤
│  HOLD    │                           │   NEXT   │
│  ┌────┐  │                           │  ┌────┐  │
│  │ ▓▓ │  │      PLAYFIELD            │  │▓▓▓ │  │
│  │▓▓  │  │      (10×20 GRID)         │  │ ▓  │  │
│  └────┘  │                           │  └────┘  │
│          │                           │          │
│ LINES: 42│                           │ COMBO: 3 │
│          │                           │          │
│ TIME:    │                           │ HIGH:    │
│ 05:23    │                           │ 12,400   │
└──────────┴───────────────────────────┴──────────┘
│           [CONTROLS FOOTER]                     │
│  ←→: Move  ↑: Rotate  Space: Drop  C: Hold     │
└─────────────────────────────────────────────────┘
```

### UI Components

**Left Panel:**
- **Hold Slot:** Shows the stored Tetromino (shape and colors)
- **Lines Cleared:** Running total
- **Time Elapsed:** Session timer (MM:SS format)

**Center Area:**
- **Playfield:** 10 columns × 20 rows visible grid (standard Tetris dimensions)
- **Danger Zone Indicator:** Top 2 rows highlighted in red when occupied
- **Falling Block:** Currently active Tetromino
- **Ghost Block:** Semi-transparent preview showing where the block will land

**Right Panel:**
- **Next Block Preview:** Shows upcoming Tetromino
- **Current Combo:** Displays active combo multiplier
- **High Score:** Session or all-time best

**Top Bar:**
- **Current Level:** Large, prominent display
- **Current Score:** Large, animated when points are earned
- **Game Title/Logo:** Centered branding

### Visual Feedback Elements

- **Match Flash:** Matched blocks glow/pulse before disappearing
- **Cascade Counter:** Number appears during multi-cascade sequences
- **Particle Effects:** Colorful explosions when blocks clear
- **Score Popup:** "+250" floating text at match locations
- **Warning Effects:** Screen shake and red vignette when near game over

---

## 8. Art Style & Theme

### Recommended Aesthetic

**Sleek Modern with Neon Accents**

- **Visual Style:** Clean, minimalist design with vibrant neon-colored blocks against a dark gradient background (deep blue to purple).
- **Block Design:** Soft-edged cubes with subtle glow effects and metallic highlights.
- **Color Palette:**
  - Blocks: Bright, saturated neon colors (electric blue, hot pink, lime green, cyber yellow, vivid orange, royal purple)
  - Background: Dark gradient (midnight blue → deep purple) with subtle grid lines
  - UI: White/cyan text with glowing accents
  
- **Animation Style:** Smooth, fluid transitions with particle effects for matches
  - Match clears: Color-appropriate particle bursts
  - Cascades: Blocks fall with slight bounce/elasticity
  - Rotation: Smooth easing with brief trail effect

- **Typography:** Bold, geometric sans-serif font (futuristic but readable)

- **Audio Cues (Recommendation):**
  - Match clear: Satisfying "pop" sound with pitch variation based on combo level
  - Cascade: Ascending musical notes for each cascade level
  - Hard drop: Deep "thunk" sound
  - Game over: Descending tone with echo effect
  - Background music: Upbeat electronic/synthwave soundtrack that intensifies with level

### Mood & Atmosphere

- **Energetic and engaging** without being overwhelming
- **Clear visual hierarchy** - gameplay elements always clearly visible
- **Accessibility considerations:**
  - Colorblind mode: Alternative patterns/symbols on blocks
  - Optional screen shake disable
  - Adjustable visual effect intensity

---

## Additional Design Notes

### Core Design Philosophy

ChromaCascade balances **strategic planning** (Tetris-style placement) with **pattern recognition** (Candy Crush matching). Players must think ahead about:

1. **Immediate placement:** Where does this shape fit best?
2. **Color opportunities:** Which colors can I match now?
3. **Cascade potential:** Will this create a chain reaction?
4. **Future setup:** Am I creating opportunities for the next block?

### Unique Selling Points

- **Dual-attribute system** creates deeper strategy than either parent game alone
- **Cascade combos** reward quick pattern recognition and planning
- **Dynamic difficulty** keeps players in the "flow state"
- **Clear skill progression** - players can see improvement through scores/levels

### Technical Considerations for Development

- **Grid System:** Standard 10×20 Tetris playfield
- **Physics:** Discrete cell-based (not continuous physics)
- **Match Detection:** Post-placement flood-fill algorithm for color matching
- **Performance:** Optimize cascade calculations for smooth 60 FPS gameplay

---

## Conclusion

ChromaCascade merges the spatial puzzle-solving satisfaction of Tetris with the rewarding cascade mechanics of match-3 games. The dual-attribute block system creates emergent complexity while remaining intuitive to learn. With clear progression, responsive controls, and satisfying visual feedback, the game offers both casual accessibility and competitive depth for dedicated players.

**Next Steps for Development:**
1. Prototype core falling block mechanics
2. Implement match-3 detection and cascade system
3. Build UI framework and HUD elements
4. Create visual assets (blocks, effects, backgrounds)
5. Develop scoring and progression systems
6. Polish with audio, animations, and juice effects
7. Playtest and balance difficulty curve

---

*End of Game Design Document*
