<?php
/**
 *
 */
class Page extends AnotherClass
{
  private $db;

  function __construct(argument)
  {
    $this->db = new Database;
    $this->error = [];
  }

  /* Page */

  public function select($data){
    $sql = "SELECT * FROM `ml_page` ORDER BY  `order` ASC";
    return $this->db->query($sql);
  }
  public function insert($data){
    $sql = "INSERT INTO `ml_page` (`id`, `name`, `order`, `parent`, `state`, `date_created`, `date_edited`)
            VALUES (NULL, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
    $params = array( 'siii', $data['name'], $data['order'], $data['parent'],  $data['state']  );
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
    $this->removeFromParents($data);
    $this->orderAfterDelete($data);
    $sql = "DELETE FROM `ml_page` WHERE `ml_page`.`id` = ?";
    $params = array('i',$data['id']);
    return $this->db->query($sql,$params);
  }

  /* Relations */

  public function attach_item($data){
    $sql = "INSERT INTO `ml_page_item` (`id`,`item_id`, `page_id`)
            VALUES (NULL, ?, ?)";
    $params = array( 'ii', $data['item_id'], $data['page_id'] );
    return $this->db->query($sql, $params);
  }
}
 ?>
