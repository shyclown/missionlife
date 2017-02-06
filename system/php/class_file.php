<?php
/**
 *
 */
class File
{
  private $filetypes;

  function __construct()
  {
    $this->db = new Database;
    $this->error = [];
    $this->create_table_file();
    $this->create_table_article_file();
    $this->create_table_garant_file();
    $this->root = $_SERVER["DOCUMENT_ROOT"].'/missionlife';
    $this->filetypes = array(
        'png' => 'image/png',
        'txt' => 'text/plain',
        'rtf' => 'application/rtf',
        'pdf' => 'application/pdf',
        'doc' => 'application/msword',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls' => 'application/vdn.ms-excel'
    );
  }

  private function create_table_file(){
    $sql = "CREATE TABLE IF NOT EXISTS `ml_file` (
            `id` int(8) NOT NULL AUTO_INCREMENT,
            `file_name` varchar(256) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
            `file_type` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
            `file_size` int(64) NOT NULL,
            `file_src` varchar(256) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
            `date_created` datetime NOT NULL,
            `date_edited` datetime NOT NULL,
            PRIMARY KEY (`id`)
            ) ENGINE=InnoDB
            DEFAULT CHARSET=utf8 COLLATE=utf8_bin";
    $this->db->query($sql);
  }
  private function create_table_article_file(){
    $sql = "CREATE TABLE IF NOT EXISTS `ml_article_file` (
            `id` int(8) NOT NULL AUTO_INCREMENT,
            `article_id`  int(8) NOT NULL,
            `file_id` int(8) NOT NULL ,
            `file_desc` varchar(64) NOT NULL ,
            PRIMARY KEY (`id`)
            ) ENGINE=InnoDB
            DEFAULT CHARSET=utf8 COLLATE=utf8_bin";
    $this->db->query($sql);
  }
  private function create_table_garant_file(){
    $sql = "CREATE TABLE IF NOT EXISTS `ml_garant_file` (
            `id` int(8) NOT NULL AUTO_INCREMENT,
            `garant_id`  int(8) NOT NULL,
            `file_id` int(8) NOT NULL ,
            PRIMARY KEY (`id`)
            ) ENGINE=InnoDB
            DEFAULT CHARSET=utf8 COLLATE=utf8_bin";
    $this->db->query($sql);
  }

  private function create_folders(){
    if (!file_exists($this->root.'/uploads')) { mkdir($this->root.'/uploads', 0777, true); }
    if (!file_exists($this->root.'/uploads/image')) { mkdir($this->root.'/uploads/image', 0777, true); }
    if (!file_exists($this->root.'/uploads/image/small')) { mkdir($this->root.'/uploads/image/small', 0777, true); }
  }

  private function store_image($ext){
    $generated_name = uniqid();
    if (!move_uploaded_file(
        $_FILES['files']['tmp_name'],
        sprintf($this->root.'/uploads/image/%s.%s', $generated_name, $ext)
    )){ return false; }
    else { return $generated_name; }
  }

  private function store_file($ext){
    $generated_name = sha1_file($_FILES['files']['tmp_name']);
    if (!move_uploaded_file(
        $_FILES['files']['tmp_name'],
        sprintf($this->root.'/uploads/%s.%s',
            $generated_name,
            $ext
        )
    )){ return false; }
    else { return $generated_name; }
  }

  private function create_thumbnail($new_name, $ext, $thumbnail_size = 250){
    $file = $this->root.'/uploads/image/'.$new_name.'.'.$ext;

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

      $filename = $this->root.'/uploads/image/small/'.$new_name.'.'.$ext;
      imagepng($tmp,$filename,0);
      imagedestroy($tmp);
      imagedestroy($src);
  }

  public function upload(){
    $this->create_folders();
    if(isset($_FILES['files'])){
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
          $this->filetypes,
          true
        )){
        throw new RuntimeException('Invalid file format.');
        }

        if($ext == 'png'){
          if(!$new_name = $this->store_image($ext)){
            throw new RuntimeException('Failed to move uploaded file.'); }
          else{
            $this->create_thumbnail($new_name, $ext, 250);
          }
        } else {
          if(!$new_name = $this->store_file($ext)){
            throw new RuntimeException('Failed to move uploaded file.');
          }
        }

        if(isset($_POST['file_name'])){ $filename = $_POST['file_name']; }
        else{ $filename = $_FILES['files']['name']; }
        $store['file_name'] = $filename;
        $store['file_type'] = $ext;
        $store['file_size'] = $_FILES['files']['size'];
        $store['file_src'] = $new_name.'.'.$ext;

      } catch (RuntimeException $e) {
            $store['error'] = $e->getMessage();
            echo json_encode($store);
            exit;
      }

      if($store){
        // store to database
        $fileID = $this->insert_new_file($store);

        if(isset($_POST['article_id'])){
          $article_file_data = array(
            'article_id' => $_POST['article_id'],
            'file_id' => $fileID
          );
          $attach = $this->attach_to_article($article_file_data);
          if($attach){ return $store; exit; }
          else{ return false; exit; }
        }
        if(isset($_POST['garant_id'])){
          if($this->removeImages($_POST['garant_id'])){
            $garant_file_data = array(
              'garant_id' => $_POST['garant_id'],
              'file_id' => $fileID
            );
            $attach = $this->attach_to_garant($garant_file_data);
            if($attach){ return $store; exit(); }
            else{ return false; exit; }
          }
        }
        return $store;
      }
    }
  }

  public function removeImages($garant_id)
  {
    $params = array("i", $garant_id);
    $sql_file = "DELETE FROM `ml_garant_file` WHERE `ml_garant_file`.`garant_id` = ?";
    return $this->db->query($sql_file, $params);
  }


  public function get_all_details($data){
    $sql =  "SELECT a.header, a.id, 'article' AS table_name
                      FROM  `ml_file` f
                        INNER JOIN  `ml_article_file` af ON af.file_id = f.id
                        INNER JOIN  `ml_article` a ON a.id = af.article_id
                        WHERE f.id = ?
                    UNION
                      SELECT g.header, g.id, 'garant' AS table_name
                        FROM  `ml_file` f
                        INNER JOIN  `ml_garant_file` gf ON gf.file_id = f.id
                        INNER JOIN  `ml_garant` g ON g.id = gf.garant_id
                      WHERE f.id = ?";
    $params = array('ii', $data['file_id'], $data['file_id']);
    return $this->db->query($sql, $params);
  }

  public function get_files_by_selected($data){
    $order;
    $search = '';
    // set oreder
    if(isset($data['order'])){
      if($data['order']){ $order = 'DESC'; }
      else { $order = 'ASC';}
    }
    if(isset($data['sort_by'])){
      if($data['sort_by'] == 'name'){ $data['sort_by'] = 'file_name'; }
      if($data['sort_by'] == 'date'){ $data['sort_by'] = 'date_created'; }
      if($data['sort_by'] == 'size'){ $data['sort_by'] = 'file_size'; }
    }
    if(isset($data['search']) && $data['search'] !=""){
      $search = "WHERE `file_name` LIKE ?";
    }
    if(isset($data['folder'])){
      if($data['folder'] == 'all'){ $str = ""; }
      else{ $str = "INNER JOIN `ml_".$data['folder']."_file` af ON af.file_id = f.id"; }
    }
    $sql = "SELECT SQL_CALC_FOUND_ROWS *
            FROM  `ml_file` f
            ".$str." ".$search."
            ORDER BY ".$data['sort_by']." ".$order." LIMIT ? , ?";
    $sql_all_rows = "SELECT FOUND_ROWS()";
    if($search == ''){
      $params = array('ii', $data['limit_min'], $data['limit_max']);
    }else{
      $srch = '%'.$data['search'].'%';
      $params = array('sii', $srch , $data['limit_min'], $data['limit_max']);
    }

    $result = $this->db->query($sql, $params);
    $all = $this->db->query($sql_all_rows);
    return array('result' => $result, 'all_rows'=> $all);
  }
  public function number_of_rows(){
    $sql = 'SELECT COUNT(*) AS `count` FROM `ml_file`';
    return $this->db->query($sql);
  }
  public function select_all($data){
    $sql = "SELECT * FROM `ml_file`";
    return $this->db->query($sql);
  }
  public function load_images($data){
    $sql = "SELECT * FROM `ml_file` WHERE `file_type` = 'png'";
    return $this->db->query($sql);
  }
  public function exclude_images($data){
    $sql = "SELECT * FROM `ml_file` WHERE `file_type` != 'png'";
    return $this->db->query($sql);
  }
  public function insert_new_file($data){
    $sql = "INSERT INTO `ml_file` (`id`, `file_name`,`file_type`, `file_size`, `file_src`, `date_created`,`date_edited`)
            VALUES (NULL, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
    $params = array( 'ssis', $data['file_name'], $data['file_type'], $data['file_size'], $data['file_src'] );
    // returns ID of inserted file
    return $this->db->query($sql, $params , 'get_id');
  }
  public function attach_to_garant($data){
    $sql = "INSERT INTO `ml_garant_file` (`id`, `garant_id`, `file_id`)
            VALUES (NULL, ?, ?)";
    $params = array( 'ii', $data['garant_id'], $data['file_id']);
    return $this->db->query($sql, $params);
  }
  public function attach_to_article($data){
    $sql = "INSERT INTO `ml_article_file` (`id`, `article_id`, `file_id`, `file_desc`)
            VALUES (NULL, ?, ?, '')";
    $params = array( 'ii', $data['article_id'], $data['file_id'] );
    return $this->db->query($sql, $params);
  }
  // update
  public function update_file($data){
    $sql = "UPDATE `ml_file` SET `file_name`=?, `file_desc`=?, `date_edited`=CURRENT_TIMESTAMP  WHERE `id` = ?";
    $params = array('ssi', $data['file_name'], $data['file_desc'], $data['file_id']);
    return $this->db->query($sql,$params);
  }
  public function update_file_desc_in_article($data){
    $sql = "UPDATE  `ml_article_file` SET  `file_desc` =  ? WHERE  `ml_article_file`.`article_id` = ? AND  `ml_article_file`.`file_id` = ?";
    $params = array('sii', $data['file_desc'], $data['article_id'], $data['file_id'] );
    return $this->db->query($sql,$params);
  }
  // remove
  public function remove_from_garant($data){
    $sql = "DELETE FROM `ml_garant_file`
            WHERE `ml_garant_file`.`file_id` = ?
            AND `ml_garant_file`.`garand_id` = ?";
    $params = array('ii', $data['file_id'], $data['garant_id']);
    return $this->db->query($sql,$params);
  }
  public function remove_from_article($data){
    $sql = "DELETE FROM `ml_garant_file`
            WHERE `ml_article_file`.`file_id` = ?
            AND `ml_article_file`.`article_id` = ?";
    $params = array('ii', $data['file_id'], $data['article_id']);
    return $this->db->query($sql,$params);
  }

  public function delete($data){
      /* Remove File */
      if($data['file_type'] == 'png'){
        unlink($this->root.'/uploads/image/'.$data['file_name']);
        unlink($this->root.'/uploads/image/small/'.$data['file_name']);
      }
      else{
        unlink($this->root.'/uploads/'.$data['file_name']);
      }
      /* Remove form File Database */
      $sql_file = "DELETE FROM `ml_file` WHERE `id` = ?";
      $params_file = array('i', $data['id']);
      $this->db->query($sql_file,$params_file);
      /* Remove form File - Garant Database */
      $sql_garant = "DELETE FROM `ml_garant_file` WHERE `ml_article_file`.`file_id` = ?";
      $params_garant = array('i', $data['id']);
      $this->db->query($sql_garant,$params_garant);
      /* Remove form File - Article Database */
      $sql_article = "DELETE FROM `ml_garant_file` WHERE `ml_article_file`.`file_id` = ?";
      $params_article = array('i', $data['id']);
      $this->db->query($sql_article,$params_article);
      return true;
  }

  public function arrayFiles($files){
      $file_ary = array();
      $file_count = count($files['files']['name']);
      $file_keys = array_keys($files['files']);
      for ($i=0; $i<$file_count; $i++) {
        foreach ($file_keys as $key) {
            $file_ary[$i][$key] = $files['files'][$key][$i];
        }
      }
      return $file_ary;
  }
  public function is_type_of($file){
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    if (false === $ext = array_search(
        $finfo->file($file['tmp_name']),
        array(
            'jpg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
        ),
        true
    )) {
        throw new RuntimeException('Invalid file format.');
    }
  }
}
?>
