<?php
$root = $_SERVER['DOCUMENT_ROOT'];
require_once($root.'/define.php');
require_once($root.'/system/php/class_mysqli.php');
require_once($root.'/system/php/class_session.php');
new Session;

//$url = 'http://missionlife/_backend/';
$url = 'http://missionlife/_frontend/';


//if(!$_SESSION){ header("Location: $url"); die('died'); }
header("Location: $url"); die('died');
?>
