<?php
$root = $_SERVER['DOCUMENT_ROOT']."/missionlife";
require_once($root.'/system/php/define.php');
require_once($root.'/system/php/class_mysqli.php');
require_once($root.'/system/php/class_form.php');

$form = new Form();

// AngularJS AJAX
$fileData = file_get_contents("php://input");
$ng_data = json_decode($fileData, true); //array



if(isset($ng_data['action']))
{
  $act = $ng_data['action'];

  if($act == 'select_all'){
    echo json_encode($form->select_all($ng_data));
  }
  if ($act == 'insert') {
    // data -> [name(128), email(256), data(text), state(bool)]
    echo json_encode($form->insert($ng_data));
  }
  if ($act == 'update_all') {
    echo json_encode($form->update_all($ng_data));
  }
  if ($act == 'delete'){
    echo json_encode($form->delete($ng_data));
  }
}



 ?>
