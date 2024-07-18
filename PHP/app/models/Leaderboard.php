<?php
class Leaderboard {
    public $scores = [];

    public function addScore($winner, $lastStarter) {
        if (!isset($this->scores[1])) {

            $this->scores[1] = 0;
        }
        if (!isset($this->scores[2])) {

            $this->scores[2] = 0;
        }
        if ($winner==$lastStarter){

            $this->scores[1]++;
            arsort($this->scores);
        }
        else{

            $this->scores[2]++;
            arsort($this->scores);

        }
    }

    public function getTopScores() {
        return array_slice($this->scores, 0, 10, true);
    }
}