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
  }


  // -- PUBLIC --

  public function select_all(){
    $sql = "SELECT * FROM `ml_form` ORDER BY  `date_created` ASC";
    return $this->db->query($sql);
  }
  public function select_by_id($data){
    $sql = "SELECT * FROM `ml_form` WHERE id = ?";
    $params = array('i',$data['id']);
    return $this->db->query($sql, $params);
  }
  public function insert($data){
    $sql = "INSERT INTO `ml_form` (`id`, `name`, `email`, `data`, `state`, `date_created`, `date_edited`)
            VALUES (NULL, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
    $params = array( 'sssi', $data['name'], $data['email'], $data['data'],  $data['state']  );
    return $this->db->query($sql, $params, 'get_id');
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
  public function add_to_folder($data){
    // delete old value after
    $sql = "INSERT INTO `ml_folder_form` (`id`,`folder_id`, `form_id`)
            VALUES (NULL, ?, ?)";
    $params = array( 'ii', $data['folder_id'], $data['form_id'] );
    return $this->db->query($sql, $params);
  }
  public function select_by_folder($data){
    $sql = "SELECT SQL_CALC_FOUND_ROWS f.* FROM `ml_form` f
            INNER JOIN `ml_folder_form` ff ON f.id = ff.form_id
            WHERE ff.folder_id = ?
            ORDER BY id DESC";
    $sql_all_rows = "SELECT FOUND_ROWS()";
    $params = array('i',$data['folder_id']);
    $result = $this->db->query($sql, $params);
    $all = $this->db->query($sql_all_rows);
    return array('result' => $result, 'all_rows'=> $all[0]['FOUND_ROWS()']);
  }

}



 ?>
