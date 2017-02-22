<?php
$root = $_SERVER['DOCUMENT_ROOT']."/missionlife";
require_once($root.'/system/php/define.php');
require_once($root.'/system/php/class_mysqli.php');
require_once($root.'/system/php/class_article.php');
require_once($root.'/system/php/class_file.php');


$file = new File();


// AngularJS AJAX
// In case of file upload
if($_POST){
  $ng_data = $_POST;
}
else{
// ajax from angularJS
$fileData = file_get_contents("php://input");
$ng_data = json_decode($fileData, true); //array
}

if(isset($ng_data['action']))
{
  if ( method_exists($file, $ng_data['action']) ){
     echo json_encode($file->{$ng_data['action']}($ng_data));
     
  }
  else{
    echo "invalid method";
  }
}
?>
