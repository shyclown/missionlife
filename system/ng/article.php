<?php

$root = $_SERVER['DOCUMENT_ROOT']."/missionlife";
require_once($root.'/system/php/define.php');
require_once($root.'/system/php/class_mysqli.php');
require_once($root.'/system/php/class_article.php');
require_once($root.'/system/php/class_file.php');

$article = new Article();

// AngularJS AJAX
$fileData = file_get_contents("php://input");
$ng_data = json_decode($fileData, true); //array



if(isset($ng_data['action']))
{
  $act = $ng_data['action'];

  if($act == 'select'){
    echo json_encode($article->select($ng_data));
  }
  elseif($act == 'insert'){
    echo json_encode($article->create_new($ng_data));
  }
  elseif ($act == 'update'){
    echo 'update: ';
    echo json_encode($article->update($ng_data));
  }
  elseif($act == 'delete'){
    echo json_encode($article->delete($ng_data));
  }
  elseif($act == 'load_files'){
    echo json_encode($article->load_files_of_article($ng_data));
  }
  elseif($act == 'update_file_desc'){
    $file = new File();
    echo json_encode($file->update_file_desc_in_article($ng_data));
  }
}
