<?php

$root = $_SERVER['DOCUMENT_ROOT']."/missionlife";
require_once($root.'/system/php/define.php');
require_once($root.'/system/php/class_mysqli.php');
require_once($root.'/system/php/class_article.php');
require_once($root.'/system/php/class_folder.php');

$article = new Article();
$folder = new Folder();

// AngularJS AJAX
$fileData = file_get_contents("php://input");
$ng_data = json_decode($fileData, true); //array

// send from ajax to be able remove it

if ( method_exists($article, $ng_data['action']) ){
   echo json_encode($article->{$ng_data['action']}($ng_data));
}
