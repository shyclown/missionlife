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
    $sql = "SELECT * FROM `ml_page` ORDER BY  `order`";
    return $this->db->query($sql);
  }
  public function insert($data){
    $this->db->query(
      "UPDATE `ml_page` SET `order`= `order` + 1 WHERE `state` = ?",
      array('i',$data['state'])
    );
    //$count = $this->db->query('SELECT COUNT(*) AS items FROM `ml_page` WHERE `state` = ?', array('i',$data['state']));
    $count = 0; //$count[0]['items'] + 1;
    $sql = "INSERT INTO `ml_page` (`id`, `name`, `order`, `parent`, `state`, `date_created`, `date_edited`)
            VALUES (NULL, ?, ?, NULL, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
    $params = array( 'sii', $data['name'], $count, $data['state']);
    return $this->db->query($sql, $params);
  }
  public function update($data){
    $sql = "UPDATE `ml_page`
            SET `name`=?, `parent`=?, `state`=?, `date_edited`= CURRENT_TIMESTAMP
            WHERE `id` = ?";
    $params = array('siii',  $data['name'],  $data['parent'], $data['state'], $data['id']);
    return $this->db->query($sql,$params);
  }

  public function reorder($data){
    if(
      isset($data['new_order'])
      && isset($data['old_order'])
      && $data['old_order'] != $data['new_order']
      && isset($data['id'])
    ){
      $new_value = $data['new_order'];
      $old_value = $data['old_order'];

      if($new_value < $old_value){
        $sql = "UPDATE `ml_page` SET `order` = `order`+1
                WHERE `order` BETWEEN ? AND ?";
        $params = array('ii', $new_value, $old_value);
      }
      elseif ($new_value > $old_value) {
        $sql = "UPDATE `ml_page` SET `order` = `order`-1
                WHERE `order` BETWEEN ? AND ?";
        $params = array('ii', $old_value, $new_value);
      }
      $this->db->query($sql, $params);
    }
    return $this->db->query(
      "UPDATE `ml_page` SET `order` = ?, `state`= ? WHERE `id` = ?",
      array('iii', $data['new_order'], $data['new_state'], $data['id'])
    );
  }

  public function delete($data){
    $this->db->query(
      "UPDATE `ml_page` SET `order` = `order`- 1 WHERE `order`> ? AND `state`= ?",
      array('ii', $data['order'], $data['state'])
    );
    return $this->db->query(
      "DELETE FROM `ml_page` WHERE `ml_page`.`id` = ?",
      array('i',$data['id'])
    );
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
