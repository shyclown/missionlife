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

  public function add_to_folder($data){
    $sql = "INSERT INTO `ml_folder_item` (`id`,`folder_id`, `item_id`, `type`)
            VALUES (NULL, ?, ?, 5)";
    $params = array( 'ii', $data['folder_id'], $data['garant_id'] );
    $this->db->query($sql, $params);
  }
  public function select_by_folder($data){
    $sql = "SELECT SQL_CALC_FOUND_ROWS f.file_src image, g.* FROM `ml_garant` g
            LEFT JOIN `ml_garant_file` gf ON gf.garant_id = g.id
            LEFT JOIN `ml_file` f ON f.id = gf.file_id
            INNER JOIN `ml_folder_item` fg ON g.id = fg.item_id
            WHERE fg.folder_id = ? AND fg.type = 5
            ORDER BY g.id DESC";
    $sql_all_rows = "SELECT FOUND_ROWS()";
    $params = array('i',$data['folder_id']);
    $result = $this->db->query($sql, $params);
    $all = $this->db->query($sql_all_rows);
    return array('result' => $result, 'all_rows'=> $all[0]['FOUND_ROWS()']);
  }

  public function select_by_id($data){
    $sql = "SELECT f.file_src image, g.* FROM `ml_garant` g
            LEFT JOIN `ml_garant_file` gf ON gf.garant_id = g.id
            LEFT JOIN `ml_file` f ON f.id = gf.file_id
            INNER JOIN `ml_folder_garant` fg ON g.id = fg.garant_id
            WHERE g.id = ? ";
    $params = array('i',$data['garant_id']);
    return $this->db->query($sql, $params);
  }

}
