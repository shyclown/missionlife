<?php
/**
 * 1 - article , 2 - folder , 3 - form , 4 - file , 5 - garant
 */
class Page
{
  private $db;

  function __construct()
  {
    $this->db = new Database;
    $this->error = [];
  }

  /* Page */

  public function select(){
    $sql = "SELECT * FROM `ml_page` ORDER BY  `id` ASC";
    return $this->db->query($sql);
  }
  public function insert($data){
    $sql = "INSERT INTO `ml_page` (`id`, `name`, `order`, `parent`, `state`, `date_created`, `date_edited`)
            VALUES (NULL, ?, 0, NULL, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
    $params = array( 's', $data['name'] );
    return $this->db->query($sql, $params);
  }
  public function update($data){
    $sql = "UPDATE `ml_page`
            SET `name`=?, `order`=?, `parent`=?, `state`=?, `date_edited`= CURRENT_TIMESTAMP
            WHERE `id` = ?";
    $params = array('sssii',  $data['name'], $data['new_order'], $data['parent'], $data['state'], $data['id']);
    return $this->db->query($sql,$params);
  }
  public function delete($data){
    //$this->removeFromParents($data);
    //$this->orderAfterDelete($data);
    $sql = "DELETE FROM `ml_page` WHERE `ml_page`.`id` = ?";
    $params = array('i',$data['id']);
    return $this->db->query($sql,$params);
  }

  /* Relations */

  public function attach_item($data){
    $sql = "INSERT INTO `ml_page_item` (`id`,`item_id`, `page_id`, `type`, `order`)
            VALUES (NULL, ?, ?, ?, ?)";
    $params = array( 'iiii', $data['item_id'], $data['page_id'], $data['type'], $data['order'] );
    return $this->db->query($sql, $params);
  }
  public function load_items($data){
    $sql = "SELECT * FROM `ml_page_item`
            WHERE `page_id`= ?
            ORDER BY `order`";
    $params = array('i',$data['page_id']);
    return $this->db->query($sql, $params);
  }
  public function remove_item($data){
    $sql = "DELETE FROM `ml_page_item` WHERE `id` = ?";
    $params = array('i',$data['id']);
    return $this->db->query($sql,$params);
  }

  private function order($data, $new_order){
    $sql_replace = "UPDATE `ml_page_item`
            SET `order`= ?
            WHERE `order` = ? AND `page_id` = ?";
    $params_replace = array('iii',  $data['order'], $new_order, $data['page_id']);
    $this->db->query($sql_replace,$params_replace);
      $sql = "UPDATE `ml_page_item`
              SET `order`= ?
              WHERE `id` = ?";
      $params = array('ii',  $new_order, $data['id']);
      return $this->db->query($sql,$params);
  }


  public function order_down($data){
    $new_order = $data['order'] + 1;
    $this->order($data, $new_order);
  }
  public function order_up($data){
    $new_order = $data['order'] - 1;
    $this->order($data, $new_order);
  }


}
 ?>
