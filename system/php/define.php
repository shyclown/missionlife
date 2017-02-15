<?php
// define configuration
define("DB_HOST", "localhost");
define("DB_USER", "root");
define("DB_PASS", "");
define("DB_NAME", "missionlife");

$root = $_SERVER['DOCUMENT_ROOT']."/missionlife";
require_once($root.'/system/php/class_mysqli.php');
require_once($root.'/system/php/tables.php');
new Tables();
