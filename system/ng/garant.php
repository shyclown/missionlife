<?php

$root = $_SERVER['DOCUMENT_ROOT']."/missionlife";
require_once($root.'/system/php/define.php');
require_once($root.'/system/php/class_mysqli.php');
require_once($root.'/system/php/class_garant.php');
require_once($root.'/system/php/upload_file.php');

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
    $new_garant_id = $garant->create_new($ng_data);
    if($ng_data['image']){ $_POST = $ng_data;  $_POST['garant_id'] = $new_garant_id;
      $stored = uploadFile();
    }
  }

  elseif ($act == 'update'){
    $garant->update($ng_data);
    function checkImageBase($img){
      $img = str_replace('data:image/png;base64,', '', $img);
      $img = str_replace(' ', '+', $img);
      return base64_encode(base64_decode($img)) === $img;
    }
    if(
      $ng_data['image'] != null &&
      checkImageBase($ng_data['image'])
    ){
        $garant->removeImages($ng_data['id']);
        $_POST = $ng_data;
        $_POST['garant_id'] = $ng_data['id'];
        $stored = uploadFile();
    }else{
      var_dump($ng_data);
      echo "not new image";
    }
  }

  elseif ($act == 'remove'){
    $garant->removeImages($ng_data['id']);
    return $garant->delete($ng_data);
  }
  elseif($act == 'delete'){
    echo json_encode($garant->delete($ng_data));
  }
}
