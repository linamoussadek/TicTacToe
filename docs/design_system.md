# Tic Tac Toe Game Design System

This file outlines the design system used for the Tic Tac Toe game developed by Owen and Lina. 
It includes details on the user interface components, colors, fonts, and interactive elements that make up the game.

## Fonts and Colors

### Fonts
- **Primary Font**: Orbitron
    - Usage: This font is used throughout the game for headings, player information, and game status messages. Orbiton matches the overall futuristic and neon-like style of the game. 
    - Source: [Google Fonts](https://fonts.google.com/specimen/Orbitron)

### Colors
- **Background Color**: `#000033` (Dark Blue)
    - Usage: This color is used as the background for the entire game interface.
- **Accent Color**: `#00FFFF` (Aqua)
    - Usage: Used for headings, button text, and game elements like the play button and confetti.
- **Secondary Accent Color**: `#800080` (Purple)
    - Usage: Used for board grid lines and button borders.

## Interactive Elements

### Start Button
- **Design**: The start button features an SVG icon of a play arrow set against a green circle background.
- **Interactivity**: Clicking the button transitions from the intro screen to the game screen.

### Game Board
- **Layout**: The game board is a 3x3 grid where players place their marks.
- **Interactivity**: Each cell of the board responds to clicks, allowing players to mark X or O.

### Modals
- **Game Rules Modal**: This modal provides game rules and is displayed when the "Game Rules" button is clicked. It can be dismissed by clicking the close button or outside the modal area.

## Game Components

### Initialization
- The game starts with an introduction screen displaying the game title and a start button.
- Players initiate gameplay by clicking the play button, which hides the intro screen and reveals the game board.

### In-Game Play
- Players take turns marking the cells of the game board with Xs and Os.
- The game checks for win conditions after each move or declares a draw if all cells are filled without a winner.

### Scoreboard
- Displays the number of wins for each player.
- Updates dynamically as players win games.

### End of the Game
- The game declares a winner when a player aligns three of their marks vertically, horizontally, or diagonally.
- A confetti animation is triggered when a player wins.
- The game can also end in a draw if all cells are marked and no winning conditions are met.

### Additional UI Elements
- **Header and Footer**: The game features a simple header with the game title and a non-intrusive footer for additional information or credits.
- **Animations**:
    - Confetti animation for celebrating a win.
    - Transition animations for hover effects on buttons and cells.

