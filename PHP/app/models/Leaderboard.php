<?php

namespace Models\Leaderboard;


class Leaderboard {
    public $scores = [];

    public function addScore($winner) {
        if (!isset($this->scores[$winner])) {
            $this->scores[$winner] = 0;
        }
        $this->scores[$winner]++;
        arsort($this->scores);
    }

    public function getTopScores() {
        return array_slice($this->scores, 0, 10, true);
    }
}

