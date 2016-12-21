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

if(isset($ng_data['action']))
{
  $act = $ng_data['action'];

  if($act == 'select_all'){
    echo json_encode($folder->select_all($ng_data));
  }
  if($act == 'insert'){
    echo json_encode($folder->insert($ng_data));
  }
  if($act == 'delete'){
    echo json_encode($folder->delete($ng_data));
  }
  if($act == 'new_parent'){
    echo json_encode($folder->update_parent($ng_data));
  }

  if($act == 'update_position'){ echo json_encode($folder->update_position($ng_data)); }
  if($act == 'update_name'){ echo json_encode($folder->update_name($ng_data)); }
  if($act == 'order_up'){
    $ng_data['new_order'] = $ng_data['order']+1;
    $ng_data['direction'] = false;
    echo json_encode($folder->order($ng_data)); }
  if($act == 'order_down'){
    $ng_data['new_order'] = $ng_data['order']-1;
    $ng_data['direction'] = true;
    echo json_encode($folder->order($ng_data)); }
}
