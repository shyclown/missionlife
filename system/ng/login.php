<?php
var_dump($_POST);
$root = $_SERVER['DOCUMENT_ROOT']."/missionlife";
require_once($root.'/system/php/define.php');
require_once($root.'/system/php/class_mysqli.php');
require_once($root.'/system/php/class_session.php');
require_once($root.'/system/php/class_account.php');
new Session;
$acc = new Account;

if($_POST && $_POST['action']){
  if($_POST['action'] == 'login'){
    $acc->login();
    //header('Location: '.$root.'/missionlife'); exit();
  }
  if($_POST['action'] == 'signin'){
    $acc->sign_in();
    //header('Location: '.$root.'/missionlife'); exit();
  }
}
else{
  header('Location: '.$root.'/missionlife/login.php'); exit();
}

?>
