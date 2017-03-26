<?php

$root = $_SERVER['DOCUMENT_ROOT']."/missionlife";
require_once($_SERVER['DOCUMENT_ROOT'].'/define.php');
require_once($root.'/system/php/class_mysqli.php');


if(isset($_GET) && isset($_GET['class']))
{
  $handle = htmlspecialchars($_GET['class']);
  require_once($root.'/system/php/class_'.$handle.'.php');

  $class_name = ucfirst ( $handle ); // uppercase first letter
  $class = new $class_name();


  if(isset($_POST)
  && isset($_POST['action'])
  ){ $data = $_POST; }
  else{
    $data = file_get_contents("php://input");
    $data = json_decode($data, true); //array
  }

  if(isset($data['action'])){
    if ( method_exists($class, $data['action']) ){
       echo json_encode($class->{$data['action']}($data));
    }
  }
}
