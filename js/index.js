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

const playerOneStatus = document.getElementById('player1Status');
const playerTwoStatus = document.getElementById('player2Status');

const rulesButton = document.getElementById('rulesButton');
const rulesModal = document.getElementById('rulesModal');

const addUserButton = document.getElementById('addUserButton');
const addUserModal = document.getElementById('addUserModal');
const addUser1Form = document.getElementById('addPlayer1Form');
const addUser2Form = document.getElementById('addPlayer2Form');

const viewUsersButton = document.getElementById('viewUsersButton');
const usersListModal = document.getElementById('usersListModal');
const usersList = document.getElementById('usersList');

const viewLeaderboardButton = document.getElementById('viewLeaderboardButton');
const leaderboardModal = document.getElementById('leaderboardModal');
const leaderboardList = document.getElementById('leaderboardprompt');

const userInfoModal = document.getElementById('userInfoModal');
const userInfo = document.getElementById('userInfo');

const spanClose = document.querySelectorAll('.close');

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
    rulesModal.style.display = 'block';
};

addUserButton.onclick = function() {
    addUserModal.style.display = 'block';
};

viewUsersButton.onclick = async function() {
    usersListModal.style.display = 'block';
    await fetchUsers();
};

viewLeaderboardButton.onclick = async function() {
    leaderboardModal.style.display = 'block';
    await fetchLeaderboards();
};

spanClose.forEach(span => {
    span.onclick = function() {
        span.parentElement.parentElement.style.display = 'none';
    };
});

window.onclick = function(event) {
    if (event.target === rulesModal) {
        rulesModal.style.display = 'none';
    }
    if (event.target === addUserModal) {
        addUserModal.style.display = 'none';
    }
    if (event.target === usersListModal) {
        usersListModal.style.display = 'none';
    }
    if (event.target === leaderboardModal) {
        leaderboardModal.style.display = 'none';
    }
    if (event.target === userInfoModal) {
        userInfoModal.style.display = 'none';
    }
};

window.onload = function() {
    fetch('http://localhost:4000/PHP/public/index.php?action=reset', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Do something with the data, e.g., update the DOM
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

playButton.onclick = function() {
    introScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
};

// FUNCTIONS

// Helper function for selecting which player is X and which is O
function decidePlayers() {
    currentPlayer = lastStarter = (lastStarter === 'X' ? 'O' : 'X');
    playerOne.textContent = `${playerOneStatus.textContent} (${currentPlayer})`;
    playerTwo.textContent = `${playerTwoStatus.textContent} (${currentPlayer === 'X' ? 'O' : 'X'})`;
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
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (boardState[cellIndex] !== null || !gameActive) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/PHP/public/index.php?action=makeMove&position=${cellIndex}&player1=${lastStarter}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (result.status === 'success') {
            boardState = result.board;
            currentPlayer = result.currentPlayer;
            const markSpan = cell.querySelector('.mark');
            markSpan.textContent = boardState[cellIndex];
            cell.classList.add(boardState[cellIndex] === 'X' ? 'draw-x' : 'draw-o');

            if (result.winner) {
                triggerConfetti();
                statusMessage.textContent = `${result.winner} Wins!`;
                gameActive = false;

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

async function appendWin (username){
    const response = await fetch(`http://localhost:4000/PHP/public/index.php?action=updateWins&username=${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
}

// fetch and display the leaderboard from PHP backend
const fetchLeaderboard = async () => {
    try {
        const response = await fetch('http://localhost:4000/PHP/public/index.php?action=getLeaderboard');
        const result = await response.json();

        if (result.status === 'success') {
            const leaderboard = result.leaderboard;
            console.log(leaderboard);
            if (parseInt(playerOneWins.textContent, 10)<leaderboard[1]){
                appendWin(playerOneStatus.textContent);
            }
            if (parseInt(playerTwoWins.textContent, 10)<leaderboard[2]){
                appendWin(playerOneStatus.textContent);
            }
            playerOneWins.textContent = `${leaderboard[1]}`;
            playerTwoWins.textContent = `${leaderboard[2]}`;
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
};

// add a new user
addUser1Form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = {
        username: formData.get('username'),
        name: formData.get('name'),
        location: formData.get('location'),
        profile_picture: formData.get('profile_picture')
    };

    try {
        const queryParams = new URLSearchParams({
            action: 'addUser',
            username: data.username,
            name: data.name,
            location: data.location,
            profile_picture: data.profile_picture,
        }).toString();
        console.log(queryParams);
    
        const response = await fetch(`http://localhost:4000/PHP/public/index.php?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if (result.status === 'success') {
            alert('User added successfully');

            addUserModal.style.display = 'none';
            console.log(data["username"]);
            playerOneStatus.textContent=data["username"];
            playerOneStatus.textContent;
        } else {
            alert('Failed to add user: ' + result.message);
        }
    } catch (error) {
        console.error('Error adding user:', error);
    }
});

addUser2Form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = {
        username: formData.get('username'),
        name: formData.get('name'),
        location: formData.get('location'),
        profile_picture: formData.get('profile_picture')
    };

    try {
        const queryParams = new URLSearchParams({
            action: 'addUser',
            username: data.username,
            name: data.name,
            location: data.location,
            profile_picture: data.profile_picture
        }).toString();
        console.log(queryParams);
    
        const response = await fetch(`http://localhost:4000/PHP/public/index.php?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if (result.status === 'success') {
            alert('User added successfully');
            addUserModal.style.display = 'none';
            console.log(data["username"]);
            playerTwoStatus.textContent=data["username"];
            playerTwoStatus.textContent;
        } else {
            alert('Failed to add user: ' + result.message);
        }
    } catch (error) {
        console.error('Error adding user:', error);
    }
});

// fetch and display users from PHP backend
const fetchUsers = async () => {
    try {
        const response = await fetch('http://localhost:4000/PHP/public/index.php?action=viewUsers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if (result.status === 'success') {
            const users = result.data;
            let usersHtml = '<ul>';
            users.forEach(user => {
                usersHtml += `<li><a href="#" class="userLink" data-username="${user.username}">${user.username}</a></li>`;
            });
            usersHtml += '</ul>';
            usersList.innerHTML = usersHtml;

            document.querySelectorAll('.userLink').forEach(link => {
                link.addEventListener('click', viewUserInfo);
            });
        } else {
            alert('Failed to retrieve users: ' + result.message);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const fetchLeaderboards = async () => {
    console.log("Reached");
    try {
        const response = await fetch('http://localhost:4000/PHP/public/index.php?action=viewLeaderboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();

        if (result.status === 'success') {
            
            const leaderboard = result.data;
            console.log(leaderboard);
            let usersHtml = '<ul>';
            leaderboard.forEach(leaderboard => {
                usersHtml += `<li><a href="#" class="userLink" data-username="${leaderboard.username}">${leaderboard.username}: </a> <p> ${leaderboard.wins}</p></li>`;
            });
            usersHtml += '</ul>';
            console.log(usersHtml);
            leaderboardList.innerHTML = usersHtml;
            console.log(leadboardList.innerHTML);

            document.querySelectorAll('.userLink').forEach(link => {
                link.addEventListener('click', viewUserInfo);
            });
        } else {
            alert('Failed to retrieve users: ' + result.message);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};


// view specific user information
const viewUserInfo = async (e) => {
    e.preventDefault();
    const username = e.target.getAttribute('data-username');

    try {
        const response = await fetch(`http://localhost:4000/PHP/public/index.php?action=viewUser&username=${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if (result.status === 'success') {
            const user = result.data;
            let userInfoHtml = `<h3>${user.username}</h3>
                <p>Name: ${user.name}</p>
                <p>Location: ${user.location}</p>
                <p>Profile Picture: <img src="${user.profile_picture}" alt="${user.username}'s profile picture" /></p>`;
            userInfo.innerHTML = userInfoHtml;
            userInfoModal.style.display = 'block';
        } else {
            alert('Failed to retrieve user info: ' + result.message);
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
};

// Add the functionality for listening for cell clicks
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// Functionality for listening for a restart
restartButton.addEventListener('click', restartGame);

// Randomizing initial game players
decidePlayers();

// Status message shows current player's turn
statusMessage.textContent = `${currentPlayer}'s Turn`;
