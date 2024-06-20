//Initializing HTML elements
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


//Defaulting the player win counts to 0

let playerOneScore = 0;
let playerTwoScore = 0;


//Creating an array of 9 winning combinations
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





//Handling certain on Click functionalitys
rulesButton.onclick = function() {
    modal.style.display = 'block';
};

span.onclick = function() {
    modal.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

playButton.onclick = function() {
    introScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
};



// FUNCTIONS

//Helper function for selecting which playe ris X and which is O
function decidePlayers() {
    currentPlayer = lastStarter = (lastStarter === 'X' ? 'O' : 'X');
    playerOne.textContent = `Player 1 (${currentPlayer})`;
    playerTwo.textContent = `Player 2 (${currentPlayer === 'X' ? 'O' : 'X'})`;
}




//Helper function that triggers confetti upon a win
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


//Event handler that marks the selected cell with the correct x or o and then checks game status
const handleCellClick = (e) => {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (boardState[cellIndex] !== null || !gameActive) {
        return;
    }

    boardState[cellIndex] = currentPlayer;
    const markSpan = cell.querySelector('.mark');
    markSpan.textContent = currentPlayer;
    cell.classList.add(currentPlayer === 'X' ? 'draw-x' : 'draw-o');

    if (checkWin(currentPlayer)) {
        triggerConfetti();
        statusMessage.textContent = `${currentPlayer} Wins!`;
        gameActive = false;
        updateScore(currentPlayer);
        setTimeout(restartGame, 3000);
    } else if (boardState.every(cell => cell !== null)) {
        statusMessage.textContent = 'Draw!';
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusMessage.textContent = `${currentPlayer}'s Turn`;
    }
};

//Constant function that checks if a player has won the game
const checkWin = (player) => {
    return winningCombinations.some(combination => {
        return combination.every(index => boardState[index] === player);
    });
};


//If somebody wins a game add one to their score
const updateScore = (player) => {
    if (player === currentPlayer) {
        playerOneScore++;
        playerOneWins.textContent = `Player 1 Wins: ${playerOneScore}`;
    } else {
        playerTwoScore++;
        playerTwoWins.textContent = `Player 2 Wins: ${playerTwoScore}`;
    }
};


//Function that clears cells and restarts game
const restartGame = () => {
    boardState.fill(null);
    cells.forEach(cell => {
        const markSpan = cell.querySelector('.mark');
        markSpan.textContent = '';
        cell.classList.remove('draw-x', 'draw-o');
    });
    decidePlayers();
    statusMessage.textContent = `${currentPlayer}'s Turn`;
    gameActive = true;
};

// END OF FUNCTIONS


//Add the functionality for listening for cell clicks
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

//Functionality for listening for a restart
restartButton.addEventListener('click', restartGame);

//Randomizing intial game players
decidePlayers();

//Status message shows current players turn
statusMessage.textContent = `${currentPlayer}'s Turn`;
