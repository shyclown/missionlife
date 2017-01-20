<?php
/**
 *
 */
class File
{

  function __construct()
  {
    $this->db = new Database;
    $this->error = [];
    $this->create_table_file();
    $this->create_table_article_file();
    $this->create_table_garant_file();
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
    $sql = "SELECT SQL_CALC_FOUND_ROWS *
            FROM  `ml_file` f
            INNER JOIN `ml_".$data['folder']."_file` af ON af.file_id = f.id
            ORDER BY ".$data['sort_by']." ".$order." LIMIT ? , ?";
    $sql_all_rows = "SELECT FOUND_ROWS()";

    $params = array('ii', $data['limit_min'], $data['limit_max']);
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
  public function resize_file($file, $w=0, $h=0, $crop=FALSE){

    $file_name = $file['name'];
    var_dump($file_name);
    $tmp_name = $file['tmp_name'];
    var_dump($tmp_name);
    // resize file an store
    /*
    list($width, $height) = getimagesize($file);
    $r = $width / $height;
    if ($crop) {
        if ($width > $height) {
            $width = ceil($width-($width*abs($r-$w/$h)));
        } else {
            $height = ceil($height-($height*abs($r-$w/$h)));
        }
        $newwidth = $w;
        $newheight = $h;
    } else {
        if ($w/$h > $r) {
            $newwidth = $h*$r;
            $newheight = $h;
        } else {
            $newheight = $w/$r;
            $newwidth = $w;
        }
    }
    $src = imagecreatefromjpeg($file);
    $dst = imagecreatetruecolor($newwidth, $newheight);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);

    return $dst;*/
  }

}



 ?>
