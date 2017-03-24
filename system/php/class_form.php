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
    //var_dump($data);
    $sql = "SELECT * FROM `ml_form` WHERE id = ?";
    $params = array('i',$data['id']);
    $res = $this->db->query($sql, $params);
  //  var_dump($res);
    return $res;
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
    if($this->db->query($sql, $params)){
      // REMOVE FROM PAGE IF USED
      $sql_remove_fromPage = "DELETE FROM `ml_page` WHERE `item_id` = ? AND `type` = ?";
      $params_remove_fromPage = array('i', $data['id']);
      return $this->db->query($sql_removeFromPage, $params_removeFromPage);
    }
  }
  public function add_to_folder($data){
    // delete old value after
    $sql = "INSERT INTO `ml_folder_item` (`id`,`folder_id`, `item_id`, `type`)
            VALUES (NULL, ?, ?, 3)";
    $params = array( 'ii', $data['folder_id'], $data['form_id'] );
    return $this->db->query($sql, $params);
  }

  public function select_by_folder($data){
    $sql = "SELECT SQL_CALC_FOUND_ROWS f.* FROM `ml_form` f
            INNER JOIN `ml_folder_item` ff ON f.id = ff.item_id
            WHERE ff.folder_id = ? AND ff.type = 3
            ORDER BY id DESC";
    $sql_all_rows = "SELECT FOUND_ROWS()";
    $params = array('i',$data['folder_id']);
    $result = $this->db->query($sql, $params);
    $all = $this->db->query($sql_all_rows);
    return array('result' => $result, 'all_rows'=> $all[0]['FOUND_ROWS()']);
  }

}



 ?>
