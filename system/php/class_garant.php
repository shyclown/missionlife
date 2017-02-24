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
  }
  // PRIVATE

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
        if ($result = $this->db->query($sql, $params , 'get_id')){ return $result; }
        else { return $data; }
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

  public function attach_file($data){
    if($this->clear_files($data['garant_id'])){
    $sql = "INSERT INTO `ml_garant_file` (`id`, `garant_id`, `file_id`)
            VALUES (NULL, ?, ?)";
    $params = array( 'ii', $data['garant_id'], $data['file_id'] );
    return $this->db->query($sql, $params);
    }
  }
  private function clear_files($garant_id){
    $params = array("i", $garant_id);
    $sql_file = "DELETE FROM `ml_garant_file` WHERE `ml_garant_file`.`garant_id` = ?";
    return $this->db->query($sql_file, $params);
  }
  public function add_to_folder($data){
    $sql = "INSERT INTO `ml_folder_form` (`id`,`folder_id`, `form_id`)
            VALUES (NULL, ?, ?)";
    $params = array( 'ii', $data['folder_id'], $data['form_id'] );
    $this->db->query($sql, $params);
  }
}
