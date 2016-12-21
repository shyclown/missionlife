<?php

$root = $_SERVER['DOCUMENT_ROOT']."/missionlife";
require_once($root.'/system/php/define.php');
require_once($root.'/system/php/class_mysqli.php');
require_once($root.'/system/php/class_garant.php');

$garant = new Garant();

// AngularJS AJAX
$fileData = file_get_contents("php://input");
$ng_data = json_decode($fileData, true); //array

if(isset($ng_data['action'])){

  $act = $ng_data['action'];
  if($act == 'test'){
    var_dump($ng_data);
  }
  elseif($act == 'select'){
    echo json_encode($garant->select_all());
  }
  elseif($act == 'insert'){
    echo json_encode($garant->create_new($ng_data));
  }
  elseif ($act == 'update'){
    echo 'update: ';
    echo json_encode($garant->update($ng_data));
  }
  elseif($act == 'delete'){
    echo json_encode($garant->delete($ng_data));
  }
}
