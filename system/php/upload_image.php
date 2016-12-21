<?php
// check if session
// log in

$root = $_SERVER["DOCUMENT_ROOT"];
if (!file_exists($root.'/files')) {
    mkdir($root.'/files', 0777, true);
    echo 'created file';
}
// listen to POST:
if($_POST){
  if($_POST['image']){
    $img = $_POST['image'];
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
    $new_name = uniqid().'.png';
    $file = $root.'/files/'.$new_name;
    $success = file_put_contents($file, $data);
    if($success){ echo '/files/'.$new_name; }
    else{ echo 'upload failed'; };
  }
}
?>
