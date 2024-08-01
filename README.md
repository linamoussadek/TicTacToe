# Tic Tac Toe Game

This repository contains a web-based Tic Tac Toe game developed as part of an assignment for the CSI3140 course on WWW Structures and Standards at the University of Ottawa. 
The game features a simple yet engaging interface designed by Lina and Owen. It allows two players to play Tic Tac Toe interactively.

## Features

- **Interactive Play**: Two players can play against each other, marking Xs and Os on a 3x3 grid.
- **Dynamic Score Tracking**: The game tracks the number of wins for each player across sessions.
- **Game Rules Modal**: Players can view the rules of the game through an interactive modal window.
- **User Management**: Players can add new users, view a list of users, and see detailed information about each user, including profile pictures.
- **Animations**: The game includes animations for marking Xs and Os, and a celebratory confetti animation when a player wins.

## Technologies Used

- HTML
- CSS
- JavaScript
- PHP
- PostgreSQL
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
3. Set up the database:
 ```bash
   psql -U postgres -d tic_tac_toe -f "db/schema.sql"
   psql -U postgres -d tic_tac_toe -f "db/seed.sql"
   ```
4. Configure the database connection in index.php:
 ```bash
   $host = 'localhost';
   $port = '5432';
   $dbname = 'tic_tac_toe';
   $user = 'postgres';
   $password = 'your_password_here';
   ```
5. Start the PHP Server:
    ```bash
   php -S localhost:4000
   ```


## Usage

- **Starting the Game**: Click the "Play" button on the introductory screen to start the game.
- **Playing the Game**: Players alternate turns by clicking on an empty cell in the grid to place their mark (X or O).
- **Viewing Game Rules**: Click the "Game Rules" button to open a modal with detailed rules.
- **Restarting the Game**: Click the "Restart Game" button to reset the board and start a new game.
- 

![image](https://github.com/user-attachments/assets/33d19ef5-7b14-43fe-99d8-12a5c286607d)


![image](https://github.com/user-attachments/assets/e9a8c4a5-2591-417b-8228-c822a47a9a46)


![image](https://github.com/user-attachments/assets/0dd44069-2abe-472a-b69c-3688db9b6ea9)

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

### Database Integration

 **Schema Design **
 
The database schema is designed to handle user information and game data efficiently. The users table stores user profiles with fields for username, name, location, and profile picture. The leaderboard table tracks the game scores, linking each score to a user through a foreign key relationship with the users table. This structure ensures data integrity and supports efficient queries for user information and game results.

 **Database Operations **
 
PHP scripts manage the interaction between the web application and the PostgreSQL database. The index.php file defines endpoints for adding users, viewing user information, and updating the leaderboard. These operations use prepared statements to prevent SQL injection attacks and ensure robust database interactions. Data seeding scripts populate the database with initial users and scores, providing a ready-to-use environment for development and testing.

### JavaScript Adaptations

 **AJAX Requests **
 
JavaScript in this project primarily handles user interactions and interface updates. We use AJAX to send asynchronous requests to the PHP backend, which processes these requests and interacts with the database. This approach allows the web application to update dynamically without requiring full page reloads. For instance, when a user is added or a move is made in the game, JavaScript sends a request to the relevant PHP endpoint, which processes the action and returns a response that JavaScript uses to update the interface.

 **Dynamic UI Updates**
 
The JavaScript code is designed to keep the user interface responsive and interactive. It dynamically updates the game board, user lists, and leaderboard based on responses from the PHP backend. Event listeners are attached to UI elements to handle actions such as adding a user, viewing users, and making moves in the game. This separation of concerns ensures that the frontend remains focused on presentation and interaction, while the backend handles logic and data management, resulting in a clean and maintainable codebase.


## Authors

- **Lina** - Style and features
- **Owen** - Style and features

## Acknowledgments

- Thanks to the instructors and teaching assistants of CSI3140 for their guidance and support throughout this project.
