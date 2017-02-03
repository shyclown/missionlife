<?php

/**
 *
 */
class Garant
{
  private $db;

  public $id;
  public $name;
  public $photo_id;
  public $motto;

  function __construct()
  {
    $this->db = new Database;
    $this->error = [];
    // create tables
    $this->create_table_garant();
  }
  // PRIVATE
  private function create_table_garant(){
    $sql = "CREATE TABLE IF NOT EXISTS `ml_garant` (
            `id` int(8) NOT NULL AUTO_INCREMENT,
            `header` varchar(128) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
            `title` varchar(128) CHARACTER SET utf8 COLLATE utf8_bin,
            `webpage` varchar(256) CHARACTER SET utf8 COLLATE utf8_bin,
            `content` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
            `state` int(1) NOT NULL,
            `date_created` datetime NOT NULL,
            `date_edited` datetime NOT NULL,
            PRIMARY KEY (`id`)
          ) ENGINE=InnoDB
          DEFAULT CHARSET=utf8 COLLATE=utf8_bin";
    $this->db->query($sql);
  }
  // PUBLIC
  public function select(){
    $sql = "SELECT f.file_src image, g.* FROM `ml_garant` g
            LEFT JOIN `ml_garant_file` gf ON gf.garant_id = g.id
            LEFT JOIN `ml_file` f ON f.id = gf.file_id
            ORDER BY g.id DESC";
    return $this->db->query($sql);
  }

  public function insert($data){
    $sql = "INSERT INTO `ml_garant` (
    `id` ,
    `header` ,
    `title` ,
    `webpage` ,
    `content` ,
    `state` ,
    `date_created` ,
    `date_edited`
    )
        VALUES (NULL, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
        $params = array( 'ssssi', $data['header'], $data['title'], $data['webpage'], $data['content'], $data['state'] );
        // returns ID of inserted draft
        return $this->db->query($sql, $params , 'get_id');
  }

  public function update($data){
    $sql = "UPDATE `ml_garant` SET
    `header`=?,
    `title`=?,
    `webpage`=?,
    `content`=?,
    `state`=?,
    `date_edited`= CURRENT_TIMESTAMP
    WHERE `id` = ?
    ";
    $params = array('ssssii',  $data['header'], $data['title'], $data['webpage'], $data['content'], $data['state'], $data['id']);
    return $this->db->query($sql,$params);
  }

  public function removeImages($garant_id)
  {
    $params = array("i", $garant_id);
    $sql_file = "DELETE FROM `ml_garant_file` WHERE `ml_garant_file`.`garant_id` = ?";
    return $this->db->query($sql_file, $params);
  }
  public function delete($data){
    $sql = "DELETE FROM `ml_garant` WHERE `ml_garant`.`id` = ?";
    $params = array('i',$data['id']);
    return $this->db->query($sql,$params);
  }
}
