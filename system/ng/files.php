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



if(isset($ng_data['action']))
{
  $act = $ng_data['action'];

  if($act == 'rows'){
    echo json_encode($file->number_of_rows()[0]);
  }
  elseif ($act == 'load_selected') {
    if(isset($ng_data['folder'])){
      if(
        $ng_data['folder'] === 'article' ||
        $ng_data['folder'] === 'garant'
      ){
        echo json_encode($file->get_files_by_selected($ng_data));
      }
      else { echo 'wrong folder';}
    }
  }
  elseif ($act == 'load_images') {
    echo json_encode($file->load_images($ng_data));
    # code...
  }
  elseif ($act == 'exclude_images') {
    echo json_encode($file->exclude_images($ng_data));
    # code...
  }
  elseif($act == 'select_all'){
    echo json_encode($file->select_all($ng_data));
  }
  elseif($act == 'details'){
    echo json_encode($file->get_all_details($ng_data));
  }
}



 ?>
