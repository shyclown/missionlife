<?
/*
require
*/
$root = $_SERVER['DOCUMENT_ROOT']."/missionlife";
require_once($root.'/system/php/define.php');
require_once($root.'/system/php/class_mysqli.php');
require_once($root.'/system/php/class_file.php');

function uploadFile()
{
  $fileClass = new File();
  $store = [];
  $root = $_SERVER["DOCUMENT_ROOT"].'/missionlife';
  if (!file_exists($root.'/uploads')) {
      mkdir($root.'/uploads', 0777, true);
  }
  if (!file_exists($root.'/uploads/image')) {
      mkdir($root.'/uploads/image', 0777, true);
  }
  if (!file_exists($root.'/uploads/image/small')) {
      mkdir($root.'/uploads/image/small', 0777, true);
  }

  // handle single file
  if(isset($_FILES['files']))
  {
    try{
      // Undefined | Multiple Files | $_FILES Corruption Attack
      // If this request falls under any of them, treat it invalid.
      if (
          !isset($_FILES['files']['error']) ||
          is_array($_FILES['files']['error'])
      ) {
          throw new RuntimeException('Invalid parameters.');
      }
      // Check $_FILES['upfile']['error'] value.
      switch ($_FILES['files']['error']) {
          case UPLOAD_ERR_OK:
              break;
          case UPLOAD_ERR_NO_FILE:
              throw new RuntimeException('No file sent.');
          case UPLOAD_ERR_INI_SIZE:
          case UPLOAD_ERR_FORM_SIZE:
              throw new RuntimeException('Exceeded filesize limit.');
          default:
              throw new RuntimeException('Unknown errors.');
      }
      // You should also check filesize here.
      if ($_FILES['files']['size'] > 10000000) {
          throw new RuntimeException('Exceeded filesize limit.');
      }
      // DO NOT TRUST $_FILES['upfile']['mime'] VALUE !!
      // Check MIME Type by yourself.
      $finfo = new finfo(FILEINFO_MIME_TYPE);
      if (false === $ext = array_search(
        $finfo->file($_FILES['files']['tmp_name']),
        array(
            'png' => 'image/png',
            'txt' => 'text/plain',
            'rtf' => 'application/rtf',
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls' => 'application/vdn.ms-excel'
        ),
        true
      )){
      throw new RuntimeException('Invalid file format.');
      }

      // If its Image
      if($ext == 'png')
      {
        $new_name = uniqid();
        if (!move_uploaded_file(
            $_FILES['files']['tmp_name'],
            sprintf($root.'/uploads/image/%s.%s',
                $new_name,
                $ext
            )
        )){ throw new RuntimeException('Failed to move uploaded file.'); }

        $file = $root.'/uploads/image/'.$new_name.'.'.$ext;
        $thumbnail_size = 250; // default size

          list($width, $height) = getimagesize($file);
          if($width > $height){
            $newheight = $thumbnail_size;
            $newwidth = ($width/$height)*$thumbnail_size;
          } else {
            $newwidth = $thumbnail_size;
            $newheight = ($height/$width)*$thumbnail_size;
          }
          $src = imagecreatefrompng($file);
          $tmp = imagecreatetruecolor($newwidth, $newheight);
          imagecopyresampled($tmp,$src,0,0,0,0, $newwidth, $newheight, $width,$height);

          $filename = $root.'/uploads/image/small/'.$new_name;
          imagepng($tmp,$filename,0);
          imagedestroy($tmp);
          imagedestroy($src);
      }
      else{
        $new_name = sha1_file($_FILES['files']['tmp_name']);
        if (!move_uploaded_file(
            $_FILES['files']['tmp_name'],
            sprintf($root.'/uploads/%s.%s',
                $new_name,
                $ext
            )
        )){ throw new RuntimeException('Failed to move uploaded file.'); }
      }


      $store['file_name'] = $_FILES['files']['name'];
      $store['file_type'] = $ext;
      $store['file_size'] = $_FILES['files']['size'];
      $store['file_src'] = $new_name.'.'.$ext;

    } catch (RuntimeException $e) {
          $store['error'] = $e->getMessage();
          echo json_encode($store);
          exit;
    }
  }

  $fileID = $fileClass->insert_new_file($store);

  if(isset($_POST['article_id'])){
    $article_file_data = array(
      'article_id' => $_POST['article_id'],
      'file_id' => $fileID
    );
    $attach = $fileClass->attach_to_article($article_file_data);
    if($attach){
      return $store;
      exit;
    }
    else{
      return false;
      exit;
    }
  }
  if(isset($_POST['garant_id'])){
    $garant_file_data = array(
      'garant_id' => $_POST['garant_id'],
      'file_id' => $fileID
    );
    $attach = $fileClass->attach_to_garant($garant_file_data);
    if($attach){
      return $store;
      exit();
    }
    else{
      return false;
      exit;
    }
  }
}
