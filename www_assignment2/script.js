// script.js
const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const statusMessage = document.getElementById('statusMessage');
const restartButton = document.getElementById('restartButton');

const playerOne = document.getElementById('player1');
const playerTwo = document.getElementById('player2');

function decidePlayers(){

let currentPlayer2 = Math.random() < 0.5 ? 'X' : 'O'; // Randomly choose 'X' or 'O'

// Display the current player
if (currentPlayer2 === 'X') {
    playerOne.textContent = 'Player 1 (X)';
    playerTwo.textContent = 'Player 2 (O)';
} else {
    playerOne.textContent = 'Player 1 (O)';
    playerTwo.textContent = 'Player 2 (X)';
}
}

decidePlayers();
const eraser = document.createElement('img');
eraser.src = 'Angelo-Gemmi-eraser.svg';
eraser.classList.add('eraser');

let currentPlayer = 'X';
let boardState = Array(9).fill(null);
let gameActive = true;

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

function triggerConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random() * 10}s`; // Random delay for staggered effect
        confettiContainer.appendChild(confetti);
    }

    // Clear confetti after animation ends
    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 4000); // Adjust timing to match confetti animation duration
}

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
        setTimeout(restartGame, 3000);
    } else if (boardState.every(cell => cell !== null)) {
        statusMessage.textContent = 'Draw!';
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusMessage.textContent = `${currentPlayer}'s Turn`;
    }
};

const checkWin = (player) => {
    return winningCombinations.some(combination => {
        return combination.every(index => boardState[index] === player);
    });
};

const restartGame = () => {
    currentPlayer = 'X';
    boardState.fill(null);
    cells.forEach(cell => cell.textContent = '');
    document.body.appendChild(eraser);
    eraser.classList.add('erase-board');
    setTimeout(() => {
        eraser.remove();
    }, 1500); // Adjust timing to match animation duration
    decidePlayers();
    statusMessage.textContent = `${currentPlayer}'s Turn`;

    gameActive = true;
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);

statusMessage.textContent = `${currentPlayer}'s Turn`;
