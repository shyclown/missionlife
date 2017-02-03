<?php

class Data
{

  function __construct(){
    $this->db = new Database;
    $this->error = [];
    // create tables
    $this->create_table_data();
  }
  private function create_table_data(){
    $sql = "CREATE TABLE IF NOT EXISTS `ml_data` (
            `id` int(8) NOT NULL AUTO_INCREMENT,
            `name` varchar(128) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
            `data` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
            `date_created` datetime NOT NULL,
            `date_edited` datetime NOT NULL,
            PRIMARY KEY (`id`)
          ) ENGINE=InnoDB
          DEFAULT CHARSET=utf8 COLLATE=utf8_bin";
    $this->db->query($sql);
  }

  public function select($data){
    if(isset($data['name'])){
      $sql = "SELECT * FROM `ml_data` WHERE name=?";
      $params = array('i', $data['name']);
    }
    else{ $sql = "SELECT * FROM `ml_data`"; $params = false; }
    return $this->db->query($sql,$params);
  }

  public function insert($data){
    $sql = "INSERT INTO `ml_data` (`id`, `name`, `data`, `date_created`, `date_edited`)
            VALUES (NULL, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
    $params = array( 'ss', $data['name'], json_encode($data['data']));
    // returns ID of inserted draft
    return $this->db->query($sql, $params , 'get_id');
  }
  public function update($data){
    $sql = "UPDATE `ml_data` SET `name`=?, `data`=?, `date_edited`=CURRENT_TIMESTAMP  WHERE `id` = ?";
    $params = array('ssi', $data['name'], json_encode($data['data']), $data['id']);
    return $this->db->query($sql,$params);
  }
  public function delete($id){
     $sql = 'DELETE FROM ml_data WHERE id = ?';
     $param = array('i', $id );
     if($this->db->query($sql, $param)){ return true; }
     return false;
   }
}
 ?>
