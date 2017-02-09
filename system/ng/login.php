<?php
$root = $_SERVER['DOCUMENT_ROOT']."/missionlife";
require_once($root.'/system/php/define.php');
require_once($root.'/system/php/class_mysqli.php');
require_once($root.'/system/php/class_session.php');
require_once($root.'/system/php/class_account.php');
new Session;
  $acc = new Account;
  $url = 'http://localhost/missionlife/index.php';
  $url_login = 'http://localhost/missionlife/login.php';

  if($_POST && $_POST['action']){
    if($_POST['action'] == 'login'){
      if($acc->login()){ header("Location: $url"); exit; }
    }
    if($_POST['action'] == 'signin'){
      if($acc->sign_in()){ header("Location: $url"); exit; }
    }
  }
  else{
    header("Location: $url_login"); exit;
  }

?>
