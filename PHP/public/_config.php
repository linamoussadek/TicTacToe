<?php

$GLOBALS["appDir"] = resolve_path("app");

const DB_SERVER = 'localhost';
const DB_USERNAME = 'postgres';
const DB_PASSWORD = 'lina';
const DB_NAME = 'tic_tac_toe';

function getDBConnection() {
    $dsn = "pgsql:host=" . DB_SERVER . ";dbname=" . DB_NAME;
    try {
        $pdo = new PDO($dsn, DB_USERNAME, DB_PASSWORD);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        die("Connection failed: " . $e->getMessage());
    }
}

function resolve_path($name) {
    if ($name == ".") {
        $publicRoot = $_SERVER["DOCUMENT_ROOT"] . "/..";
        $appRoot = $_SERVER["DOCUMENT_ROOT"];
    } else if ($_SERVER["DOCUMENT_ROOT"] != "") {
        $publicRoot = $_SERVER["DOCUMENT_ROOT"] . "/../$name";
        $appRoot = $_SERVER["DOCUMENT_ROOT"] . "/$name";
    } else {
        return "../{$name}";
    }

    return file_exists($publicRoot) ? realpath($publicRoot) : realpath($appRoot);
}

spl_autoload_register(function ($fullName) {
    $parts = explode("\\", $fullName);
    $len = count($parts);
    $className = $parts[$len - 1];
    if (file_exists($GLOBALS["appDir"] . "/models/{$className}.php")) {
        require_once $GLOBALS["appDir"] . "/models/{$className}.php";
    }
});

