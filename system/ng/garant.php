<?php

$root = $_SERVER['DOCUMENT_ROOT']."/missionlife";
require_once($root.'/system/php/define.php');
require_once($root.'/system/php/class_mysqli.php');
require_once($root.'/system/php/class_garant.php');

$garant = new Garant();

// AngularJS AJAX
// In case of file upload
if($_POST){
  $ng_data = $_POST;
}
else{
// ajax from angularJS
$garantData = file_get_contents("php://input");
$ng_data = json_decode($garantData, true); //array
}

if(isset($ng_data['action']))
{
  if ( method_exists($garant, $ng_data['action']) ){
     echo json_encode($garant->{$ng_data['action']}($ng_data));
  }
}
