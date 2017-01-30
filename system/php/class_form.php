<?php
/**
 *
 */
class Form
{
  private $db;
  public $id;
  public $name;

  function __construct(){
    $this->db = new Database;
    $this->error = [];
    $this->create_table_form();
  }

  private function create_table_form(){
    $sql = "CREATE TABLE IF NOT EXISTS `ml_form` (
            `id` int(8) NOT NULL AUTO_INCREMENT,
            `name` varchar(128) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
            `email` varchar(256) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
            `data` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
            `state` int(1) NOT NULL,
            `date_created` datetime NOT NULL,
            `date_edited` datetime NOT NULL,
            PRIMARY KEY (`id`)
          ) ENGINE=InnoDB
          DEFAULT CHARSET=utf8 COLLATE=utf8_bin";
    $this->db->query($sql);
  }
  // -- PUBLIC --

  public function select_all(){
    $sql = "SELECT * FROM `ml_form` ORDER BY  `date_created` ASC";
    return $this->db->query($sql);
  }
  public function select_id($data){
    $sql = "SELECT * FROM `ml_form` WHERE id = ?";
    $params = array('i',$data['id']);
    return $this->db->query($sql, $params);
  }
  public function insert($data){
    $sql = "INSERT INTO `ml_form` (`id`, `name`, `email`, `data`, `state`, `date_created`, `date_edited`)
            VALUES (NULL, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
    $params = array( 'sssi', $data['name'], $data['email'], $data['data'],  $data['state']  );
    return $this->db->query($sql, $params);
  }
  public function update_all($data){
    $sql = "UPDATE `ml_form` SET `name`=?, `email`=?, `data`=?, `state`=?,
    `date_edited`=CURRENT_TIMESTAMP WHERE `id` = ?";
    $params = array('sssii',  $data['name'], $data['email'], $data['data'], $data['state'], $data['id']);
    return $this->db->query($sql,$params);
  }
  public function delete($data){
    $sql = "DELETE FROM `ml_form` WHERE `ml_form`.`id` = ?";
    $params = array('i',$data['id']);
    return $this->db->query($sql,$params);
  }

}



 ?>
