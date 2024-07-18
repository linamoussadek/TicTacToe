# Tic Tac Toe Game

This repository contains a web-based Tic Tac Toe game developed as part of an assignment for the CSI3140 course on WWW Structures and Standards at the University of Ottawa. 
The game features a simple yet engaging interface designed by Lina and Owen. It allows two players to play Tic Tac Toe interactively.

## Features

- **Interactive Play**: Two players can play against each other, marking Xs and Os on a 3x3 grid.
- **Dynamic Score Tracking**: The game tracks the number of wins for each player across sessions.
- **Game Rules Modal**: Players can view the rules of the game through an interactive modal window.
- **Animations**: The game includes animations for marking Xs and Os, and a celebratory confetti animation when a player wins.

## Technologies Used

- HTML
- CSS
- JavaScript
- PHP
- [Orbitron Font from Google Fonts](https://fonts.google.com/specimen/Orbitron)

## Design System

For a detailed overview of the design system used in this project, see the [Design System documentation](/docs/design_system.md).

## Installation

To get started with this project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/linamoussadek/TicTacToe.git
   ```
2. Navigate to the project directory:
   ```bash
   cd TicTacToe
   ```
3. Open the `index.html` file in a web browser to start playing the game.

## Usage

- **Starting the Game**: Click the "Play" button on the introductory screen to start the game.
- **Playing the Game**: Players alternate turns by clicking on an empty cell in the grid to place their mark (X or O).
- **Viewing Game Rules**: Click the "Game Rules" button to open a modal with detailed rules.
- **Restarting the Game**: Click the "Restart Game" button to reset the board and start a new game.

![image](https://github.com/linamoussadek/TicTacToe/assets/90733151/5fb32301-9629-4634-9e10-28e88b419eac)

![image](https://github.com/linamoussadek/TicTacToe/assets/90733151/1ab72f03-866e-45b4-8dd7-a2640a903d84)

![image](https://github.com/linamoussadek/TicTacToe/assets/90733151/1c638e91-10fb-492e-85c1-651935505884)

## PHP integration

### Session Management

PHP sessions are employed to maintain the game state and leaderboard across different HTTP requests. When a new session starts, the game state and leaderboard are initialized. This ensures that all game-related data is preserved for the duration of the user's interaction with the game.

1. **Session initialization**: When the game is first started, PHP checks if the game and leaderboard sessions exist. If not, it initializes them.
2. **Persistent data**: Game state, including the board configuration and current player, is stored in the `$_SESSION` superglobal, so that it persists even when the user refreshes the page.

### API Endpoints

The PHP server exposes API endpoints to handle different game actions. These endpoints respond to AJAX requests made from the client-side JavaScript.

1. **Action detection**: The PHP script detects the requested action (making a move, resetting the game, fetching the leaderboard) based on the HTTP request method and parameters.
2. **Make move**: When a move is made by a player (place a X or O):
    - The server receives the position of the move and the current player.
    - The server updates the game state and checks for a winner.
    - If a player wins, their score is updated in the leaderboard.
    - The updated game state and current player are sent back to the client.
3. **Reset game**: When the game is reset:
    - The game state is re-initialized.
    - The new game state is sent back to the client to update the UI.
4. **Fetch leaderboard**: When the leaderboard is requested:
    - The server retrieves the scores from the leaderboard.
    - The leaderboard data is sent back to the client for display.

### TicTacToe Game and Leaderboard Models

The game logic is located in PHP classes that represent the game and the leaderboard.

1. **Game state management**:
    - The game class (`TicTacToe.php`) handles the board configuration, the current player, and the game status (e.g., ongoing, draw, or win).
    - The `makeMove` method updates the board and checks for a winning condition.
    - The `reset` method clears the board and sets up a new game.
2. **Leaderboard management**:
    - The leaderboard class (`Leaderboard.php`) tracks the scores of the players.
    - When a player wins, their score is updated.
    - The leaderboard can be queried to return the scores.

### JavaScript Adaptations

The JavaScript code (`index.js`) is adapted to interact with the PHP backend via AJAX calls. Instead of handling the game logic and state locally, it now sends requests to the server and updates the UI based on the server's responses.

1. **AJAX calls**: JavaScript functions make AJAX requests to the PHP API endpoints for actions like making moves, resetting the game, and fetching the leaderboard.
2. **UI updates**: The responses from the server (e.g., the updated board state, current player, and game status) are used to update the game interface dynamically.


## Authors

- **Lina** - Style and features
- **Owen** - Style and features

## Acknowledgments

- Thanks to the instructors and teaching assistants of CSI3140 for their guidance and support throughout this project.
