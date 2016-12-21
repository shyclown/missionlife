<?php

$root = $_SERVER['DOCUMENT_ROOT']."/missionlife";
require_once($root.'/system/php/define.php');
require_once($root.'/system/php/class_mysqli.php');
require_once($root.'/system/php/class_file.php');
require_once($root.'/system/php/upload_file.php');

echo json_encode(uploadFile());
