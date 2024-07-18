<?php
class TicTacToe {
    public $board = [];
    public $currentPlayer = 'X';
    public $winner = null;

    public function __construct() {
        $this->board = array_fill(0, 9, null);
    }

    public function makeMove($position) {
        if ($this->board[$position] === null && $this->winner === null) {
            $this->board[$position] = $this->currentPlayer;
            if ($this->checkWinner()) {
                $this->winner = $this->currentPlayer;


            }
            $this->currentPlayer = $this->currentPlayer === 'X' ? 'O' : 'X';
        }
    }

    public function reset(){
        $this->board = array_fill(0, 9, null);
        $this ->currentPlayer = 'X';
        $this -> winner = null;

    }

    private function checkWinner() {
        $winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        foreach ($winningCombinations as $combination) {
            if ($this->board[$combination[0]] !== null &&
                $this->board[$combination[0]] === $this->board[$combination[1]] &&
                $this->board[$combination[1]] === $this->board[$combination[2]]) {
                return true;
            }
        }
        return false;
    }
}