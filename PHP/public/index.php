<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '_config.php';
require '../app/models/Leaderboard.php';
require '../app/models/TicTacToe.php';

session_start();

// Database connection parameters
$host = 'localhost';
$port = '5432';
$dbname = 'tic_tac_toe';
$user = 'postgres';
$password = 'Hockey@2003';

// Data Source Name (DSN) for PostgreSQL
$dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
$pdo = null;

try {
    // Create a PDO instance
    $pdo = new PDO($dsn, $user, $password);

    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $e->getMessage()]);
    exit;
}

if (!isset($_SESSION['game'])) {
    $_SESSION['game'] = new TicTacToe();
    error_log("Game initialized.");
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
                $playerOne = $_GET['player1'];
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
        case 'addUser':
            $data = json_decode(file_get_contents('php://input'), true);
            $username = $_GET['username'];
            $name = isset($_GET['name']) ? $_GET['name'] : null;
            $location = isset($_GET['location']) ? $_GET['location'] : null;
            $profilePicture = isset($_GET['profile_picture']) ? $_GET['profile_picture'] : null;

            $sql = "INSERT INTO users (username, name, location, profile_picture) 
                    VALUES (:username, :name, :location, :profile_picture)";

            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':location', $location);
            $stmt->bindParam(':profile_picture', $profilePicture);

            if ($stmt->execute()) {
                $sql2 = "INSERT INTO leaderboard (username, wins) 
                    VALUES (:username, 0)";
                     $stmt2 = $pdo->prepare($sql2);
                     $stmt2->bindParam(':username', $username);
                     if ($stmt2->execute()) {
                $response = [
                    'status' => 'success',
                    'message' => 'User added successfully'
                ];
            }
            else{
                $response = [
                    'status' => 'error',
                    'message' => 'Failed to add user'
                ];
            }
        
            } else {
                $response = [
                    'status' => 'error',
                    'message' => 'Failed to add user'
                ];
            }
            break;
        case 'viewUsers':
            $sql = "SELECT id, username, name, location, profile_picture FROM users";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $response = [
                'status' => 'success',
                'data' => $users
            ];
            break;
        case 'viewUser':
            $username = $_GET['username'];
            $sql = "SELECT id, username, name, location, profile_picture FROM users WHERE username=:username";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':username', $username);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            $response = [
                'status' => 'success',
                'data' => $user
            ];
            break;
        case 'viewLeaderboard':
            $sql = "SELECT username, wins FROM leaderboard order by wins desc";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $leaderboard = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $response = [
                'status' => 'success',
                'data' => $leaderboard
            ];
            break;

        case 'updateWins':
            $username = $_GET['username'];
            $sql = "SELECT wins FROM leaderboard WHERE username=:username";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['username' => $username]);

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        $currentWins = $result['wins'];
        $newWins = $currentWins + 1;

        // Update the wins
        $updateSql = "UPDATE Leaderboard SET wins = :wins WHERE username = :username";
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute(['wins' => $newWins, 'username' => $username]);

        echo "Wins updated successfully!";
    } else {
        echo "User not found in the Leaderboard.";
    }
        case 'reset':
            $game->reset();
            $_SESSION['game'] = $game;
            $response = [
                'status' => 'success',
                'board' => $game->board,
                'currentPlayer' => $game->currentPlayer,
                'winner' => $game->winner
            ];
            break;
        case 'getLeaderboard':
            $response = [
                'status' => 'success',
                'leaderboard' => $leaderboard->getTopScores()
            ];
            break;
    }
}

echo json_encode($response);

