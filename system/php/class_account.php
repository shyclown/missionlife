<?php

class Account
{

  function __construct(){
    $this->db = new Database;
    $this->error = [];
    // create tables
    $this->create_table_account();
  }
  private function create_table_account(){
    $sql = "CREATE TABLE IF NOT EXISTS `ml_article` (
            `id` int(8) NOT NULL AUTO_INCREMENT,
            `name` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
            `password` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
            `state` int(1) NOT NULL,
            `date_created` datetime NOT NULL,
            `date_edited` datetime NOT NULL,
            PRIMARY KEY (`id`)
          ) ENGINE=InnoDB
          DEFAULT CHARSET=utf8 COLLATE=utf8_bin";
    $this->db->query($sql);
  }
  public function createAccount($data){
    // create account
    $hash_password = $hash($data['password']);
    $email = $data['email'];

  }
  public function search($data){
    $sql = "SELECT * FROM `ml_article` WHERE `header` LIKE CONCAT('%',?,'%')";
    $params = array('s',$data['search']);
    return $this->db->query($sql, $params);
  }

  public function load_files($data){
    $sql = "SELECT f.*, af.file_desc
            FROM `ml_article_file` af
            INNER JOIN `ml_file` f
            ON af.file_id = f.id WHERE af.article_id = ?";
    $params = array('i',$data['id']);
    return $this->db->query($sql,$params);
  }
  public function number_of_rows(){
    $sql = 'SELECT COUNT(*) AS `count` FROM `ml_article`';
    return $this->db->query($sql);
  }
  /* Select ALL Articles */
  public function select_all($data){
    $sql = "SELECT id, header FROM `ml_article` ORDER BY id DESC";
    return $this->db->query($sql);
  }
  /* Select articles IN FOLDER */
  public function select($data){
    $order = 'DESC';
    $sort_by = 'id';
    if(isset($data['order'])){
      if($data['order']){ $order = 'ASC'; }
      else { $order = 'DESC';}
    }
    if(isset($data['sort_by'])){
      if($data['sort_by'] == 'name'){ $sort_by = 'header'; }
      if($data['sort_by'] == 'date'){ $sort_by = 'date_created'; }
      //if($data['sort_by'] == 'size'){ $sort_by = 'file_size'; }
    }
    $sql = "SELECT SQL_CALC_FOUND_ROWS a.* FROM `ml_article` a
            INNER JOIN `ml_article_folder` af ON a.id = af.article_id
            WHERE af.folder_id = ?
            ORDER BY ".$sort_by." ".$order." LIMIT ? , ?";
    $sql_all_rows = "SELECT FOUND_ROWS()";
    $params = array('iii',$data['folder_id'],$data['limit_min'],$data['limit_max']);
    $result = $this->db->query($sql, $params);
    $all = $this->db->query($sql_all_rows);
    return array('result' => $result, 'all_rows'=> $all[0]['FOUND_ROWS()']);
  }
  public function select_by_id($data){
    $sql = "SELECT * FROM `ml_article` WHERE id = ?";
    $params = array('i',$data['id']);
    return $this->db->query($sql,$params);
  }
  public function insert($data){
    $sql = "INSERT INTO `ml_article` (`id`, `header`, `content`, `state`, `date_created`, `date_edited`)
            VALUES (NULL, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
    $params = array( 'ssi', $data['header'], $data['content'], $data['state'] );
    // returns ID of inserted draft
    $article_id = $this->db->query($sql, $params , 'get_id');
    $this->add_to_folder($article_id, $data['folder_id']);
    return $article_id;
  }
  public function add_to_folder($article_id, $folder_id){
    $sql = "INSERT INTO `ml_article_folder` (`id`,`article_id`, `folder_id`)
            VALUES (NULL, ?, ?)";
    $params = array( 'ii', $article_id, $folder_id );
    $this->db->query($sql, $params);
  }
  public function update($data){
    $sql = "UPDATE `ml_article` SET `header`=?, `content`=?, `state`=?, `date_edited`=CURRENT_TIMESTAMP  WHERE `id` = ?";
    $params = array('ssii', $data['header'], $data['content'], $data['state'], $data['id']);
    return $this->db->query($sql,$params);
  }
  public function delete($data){
    $params = array('i',$data['id']);
    $sql_article = "DELETE FROM `ml_article`
                    WHERE `ml_article`.`id` = ?";
    $sql_article_file = "DELETE FROM `ml_article_file`
                          WHERE `ml_article_file`.`article_id` = ?";
    $sql_article_folder = "DELETE FROM `ml_article_folder`
                          WHERE `ml_article_folder`.`article_id` = ?";
    $article = $this->db->query($sql_article,$params);
    $file = $this->db->query($sql_article_file,$params);
    $folder = $this->db->query($sql_article_folder,$params);
    return $article && $file && $folder;
  }
}
?>
