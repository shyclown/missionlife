<?php
$root = $_SERVER['DOCUMENT_ROOT']."/missionlife";
require_once($root.'/system/php/define.php');
require_once($root.'/system/php/class_mysqli.php');
require_once($root.'/system/php/class_article.php');
require_once($root.'/system/php/class_file.php');

$article = new Article();
$file = new File();
// AngularJS AJAX
$fileData = file_get_contents("php://input");
$ng_data = json_decode($fileData, true); //array

if ( method_exists($article, $ng_data['action']) ){
   echo json_encode($article->{$ng_data['action']}($ng_data));
}
