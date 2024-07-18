<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

require_once '_config.php';
require  '../app/models/Leaderboard.php';
require  '../app/models/TicTacToe.php';

session_start();



if (!isset($_SESSION['game'])) {
    $_SESSION['game'] = new TicTacToe();
    error_log("Game initialized.");
    console.log($_SESSION['game']);
}

if (!isset($_SESSION['leaderboard'])) {
    $_SESSION['leaderboard'] = new Leaderboard();
    error_log("Leaderboard initialized.");
}

$game = $_SESSION['game'];
$leaderboard = $_SESSION['leaderboard'];

$response = ['status' => 'error', 'message' => 'Invalid request'];
$action = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])) {
    $action = $_GET['action'];
}

if ($action) {
    switch ($action) {
        case 'makeMove':
            if (isset($_GET['position']) && isset($_GET['player1'])) {
                $position = intval($_GET['position']);
                $playerOne= $_GET['player1'];
                $game->makeMove($position);
                if ($game->winner) {
                    $leaderboard->addScore($game->winner, $playerOne);
                }
                $_SESSION['game'] = $game;
                $_SESSION['leaderboard'] = $leaderboard;
                $response = [
                    'status' => 'success',
                    'board' => $game->board,
                    'currentPlayer' => $game->currentPlayer,
                    'winner' => $game->winner
                ];
            } else {
                $response['message'] = 'Position is required for making a move';
            }
            break;
        case 'reset':
            $game->reset();
            $_SESSION['game'] = $game;
            $response = [
                    'status' => 'success',
                    'board' => $game->board,
                    'currentPlayer' => $game->currentPlayer,
                    'winner' => $game->winner
                ];
            
        case 'getLeaderboard':
            $response = [
                'status' => 'success',
                'leaderboard' => $leaderboard->getTopScores()
            ];
            break;
    }
}

echo json_encode($response);

