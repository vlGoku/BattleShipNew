# Battleship Game

An interactive Battleship game where the player competes against the computer. With unique captain abilities and a user-friendly interface, this project brings a fresh twist to the classic Battleship game.

## Features

- **Classic Battleship Gameplay**: Players and the CPU place ships and try to sink each other's fleets.
- **Captains with Special Abilities**: 
  - Captain Giuseppe: Attacks a random field with double precision.
  - Captain Astrid: Enables a multi-attack on a row of fields.
  - Captain William: Destroys an entire row or column.
  - Captain Katrin: Attacks a field and destroys adjacent fields.
- **Visual Feedback**: Hits and misses are highlighted with visual effects.
- **Intelligent Turn Control**: The computer performs targeted attacks without hitting the same field twice.

## Tech Stack

- **HTML5**: Provides the structure for the application.
- **CSS3**: Adds styling and enhances the user interface.
- **JavaScript (ES6+)**: Handles the game logic, interactions, and dynamic rendering.

## How to Play

1. Start the game by selecting your captain. Each captain has a unique special ability that can change the course of the game.
2. The game automatically places your ships and the CPU's ships.
3. Attack the CPU's game board by clicking on the fields. 
   - Hits are marked in red.
   - Misses are marked in gray.
4. Use your captain's special ability strategically to gain an advantage.
5. The game ends when all ships of one side are destroyed.

## File Structure

src/ 
├── index.html # Main HTML file 
├── index.js # Entry point of the game logic 
├── styles.css # Game styling 
└── 
modules/ # Game modules 
├── ship.js # Ship class and logic 
├── gameboard.js # Gameboard class and logic 
├── player.js # Player class and turn management 
├── captain.js # Base Captain class + individual captains
├── captainAstrid.js # Captain Astrid's special ability 
├── captainGiuseppe.js # Captain Giuseppe's special ability 
├── captainWilliam.js # Captain William's special ability 
└── captainKatrin.js # Captain Katrin's special ability