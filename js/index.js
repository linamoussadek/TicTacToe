// Initializing HTML elements
const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const statusMessage = document.getElementById('statusMessage');
const restartButton = document.getElementById('restartButton');
const playButton = document.getElementById('playButton');
const introScreen = document.getElementById('introScreen');
const gameScreen = document.getElementById('gameScreen');
const playerOne = document.getElementById('player1');
const playerTwo = document.getElementById('player2');
const playerOneWins = document.getElementById('player1Wins');
const playerTwoWins = document.getElementById('player2Wins');

const rulesButton = document.getElementById('rulesButton');
const modal = document.getElementById('rulesModal');
const span = document.getElementsByClassName('close')[0];

const leaderboardButton = document.getElementById('leaderboardButton');
const leaderboardModal = document.getElementById('leaderboardModal');
const leaderboardContent = document.getElementById('leaderboardContent');

// Defaulting the player win counts to 0
let playerOneScore = 0;
let playerTwoScore = 0;

// Creating an array of 9 winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let currentPlayer;
let lastStarter = 'O';
let boardState = Array(9).fill(null);
let gameActive = true;

// Handling certain on Click functionalities
rulesButton.onclick = function() {
    modal.style.display = 'block';
};

span.onclick = function() {
    modal.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

playButton.onclick = function() {
    introScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
};
/*
leaderboardButton.onclick = function() {
    leaderboardModal.style.display = 'block';
    fetchLeaderboard();
};*/

window.onclick = function(event) {
    if (event.target === leaderboardModal) {
        leaderboardModal.style.display = 'none';
    }
};

// FUNCTIONS

// Helper function for selecting which player is X and which is O
function decidePlayers() {
    currentPlayer = lastStarter = (lastStarter === 'X' ? 'O' : 'X');
    playerOne.textContent = `Player 1 (${currentPlayer})`;
    playerTwo.textContent = `Player 2 (${currentPlayer === 'X' ? 'O' : 'X'})`;
}

// Helper function that triggers confetti upon a win
function triggerConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random() * 10}s`;
        confettiContainer.appendChild(confetti);
    }
    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 4000);
}

// Event handler that marks the selected cell with the correct x or o and then checks game status
const handleCellClick = async (e) => {
    console.log("Reached");
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (boardState[cellIndex] !== null || !gameActive) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/PHP/public/index.php?action=makeMove&position=${cellIndex}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("Reached before response");

        const result = await response.json();

        console.log(response);
        if (result.status === 'success') {
            boardState = result.board;
            console.log(result.board);
            console.log(result.currentPlayer);
            currentPlayer = result.currentPlayer;
            const markSpan = cell.querySelector('.mark');
            markSpan.textContent = boardState[cellIndex];
            cell.classList.add(boardState[cellIndex] === 'X' ? 'draw-x' : 'draw-o');

            if (result.winner) {
                triggerConfetti();
                statusMessage.textContent = `${result.winner} Wins!`;
                gameActive = false;
                updateScore(result.winner);
                fetchLeaderboard();
                setTimeout(restartGame, 3000);
            } else if (boardState.every(cell => cell !== null)) {
                statusMessage.textContent = 'Draw!';
                gameActive = false;
            } else {
                statusMessage.textContent = `${currentPlayer}'s Turn`;
            }
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error('Error making move:', error);
    }
};


// if somebody wins a game add one to their score
const updateScore = (player) => {
    if (player === currentPlayer) {
        playerOneScore++;
        playerOneWins.textContent = `Player 1 Wins: ${playerOneScore}`;
    } else {
        playerTwoScore++;
        playerTwoWins.textContent = `Player 2 Wins: ${playerTwoScore}`;
    }
};

// Function that clears cells and restarts game
const restartGame = async () => {
    const response = await fetch('http://localhost:4000/PHP/public/index.php?action=reset');
    const result = await response.json();
    if (result.status === 'success') {
    boardState.fill(null);
    cells.forEach(cell => {
        const markSpan = cell.querySelector('.mark');
        markSpan.textContent = '';
        cell.classList.remove('draw-x', 'draw-o');
    });
    decidePlayers();
    statusMessage.textContent = `${currentPlayer}'s Turn`;
    gameActive = true;
}
};

// Function to fetch and display the leaderboard from PHP backend
const fetchLeaderboard = async () => {
    try {
        const response = await fetch('http://localhost:4000/PHP/public/index.php?action=getLeaderboard');
        const result = await response.json();

        if (result.status === 'success') {
            const leaderboard = result.leaderboard;
            leaderboardContent.innerHTML = '';
            for (const [player, score] of Object.entries(leaderboard)) {
                const entry = document.createElement('div');
                entry.textContent = `${player}: ${score} wins`;
                leaderboardContent.appendChild(entry);
            }
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
};

// END OF FUNCTIONS

// Add the functionality for listening for cell clicks
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// Functionality for listening for a restart
restartButton.addEventListener('click', restartGame);

// Randomizing initial game players
decidePlayers();

// Status message shows current player's turn
statusMessage.textContent = `${currentPlayer}'s Turn`;
