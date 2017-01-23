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

  private function create_table_folder(){
    $sql = "CREATE TABLE IF NOT EXISTS `ml_form` (
            `id` int(8) NOT NULL AUTO_INCREMENT,
            `name` varchar(128) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
            `data` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
            `order` int(3),
            `parent` int(8),
            `state` int(1) NOT NULL,
            `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `date_edited` datetime NOT NULL,
            PRIMARY KEY (`id`)
          ) ENGINE=InnoDB
          DEFAULT CHARSET=utf8 COLLATE=utf8_bin";
    $this->db->query($sql);
  }
  // -- PUBLIC --

  public function select_all(){
    $sql = "SELECT * FROM `ml_form` ORDER BY  `order` ASC";
    return $this->db->query($sql);
  }
  public function insert($data){
    $sql = "INSERT INTO `ml_folder` (`id`, `name`, `order`, `parent`, `state`, `date_created`, `date_edited`)
            VALUES (NULL, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
    $params = array( 'siii', $data['name'], $data['order'], $data['parent'],  $data['state']  );
    return $this->db->query($sql, $params);
  }
  public function update_all($data){
    $this->newOrder($data);
    $sql = "UPDATE `ml_folder` SET `name`=?, `order`=?, `parent`=?, `state`=?,
    `date_edited`=CURRENT_TIMESTAMP WHERE `id` = ?";
    $params = array('sssii',  $data['name'], $data['new_order'], $data['parent'], $data['state'], $data['id']);
    return $this->db->query($sql,$params);
  }
  public function update_parent($data){
    //if($data['parent'] === null){ $data['parent'] = 'NULL';}
    $sql = "UPDATE `ml_folder` SET `parent`= ?,`date_edited`=CURRENT_TIMESTAMP
            WHERE `id` = ?";
    $params = array('ii',  $data['parent'], $data['id']);
    return $this->db->query($sql,$params);
  }
  public function delete($data){
    $this->removeFromParents($data);
    $this->orderAfterDelete($data);
    $sql = "DELETE FROM `missionlife`.`ml_folder` WHERE `ml_folder`.`id` = ?";
    $params = array('i',$data['id']);
    return $this->db->query($sql,$params);
  }

  public function removeFromParents($data){
    $sql_parent = "UPDATE `ml_folder` SET
    `parent`= NULL, `date_edited`=CURRENT_TIMESTAMP
    WHERE `parent` = ?";
    $params_parent = array('i', $data['id']);
    $this->db->query($sql_parent, $params_parent);
  }

  public function orderAfterDelete($data){
    $sql_reorder = "UPDATE `ml_folder` SET `order`= `order` - 1
    WHERE `order` > ? AND `parent` = ?";
    $params_reorder = array('ii',$data['order'],$data['parent']);
    $this->db->query($sql_reorder, $params_reorder);
  }

  public function order($data){
    if($data['order'] != $data['new_order'])
    {
      $change = $data['direction'] ? '+1' : '-1';
      $max = max($data['order'], $data['new_order']) ;
      $min = min($data['order'], $data['new_order']) ;

      $sql = 'UPDATE `ml_folder` SET `order`= `order`'.$change.' WHERE `order` >= ? AND `order` <= ? AND `parent` <=> ?';
      $params = array('iii', $min, $max, $data['parent']);
      $q2 = $this->db->query($sql, $params);

      $sql_item = "UPDATE `ml_folder` SET `order`= ? WHERE `id` = ?";
      $params_item = array('ii', $data['new_order'], $data['id']);
      $q1 = $this->db->query($sql_item, $params_item);

      return $q1 && $q2;
    }
  }
  public function update_position($data){
    $sql = "UPDATE `ml_folder` SET `position`= ?  WHERE `id` = ? ";
    $params = array('si', $data['position'], $data['id']);
    return $this->db->query($sql, $params);
  }
  public function update_name($data){
    $sql = "UPDATE `ml_folder` SET `name`= ?  WHERE `id` = ? ";
    $params = array('si', $data['name'], $data['id']);
    return $this->db->query($sql, $params);
  }

  public function removeLinks($data){
    $sql_link = "DELETE FROM `missionlife`.`ml_folder` folder
                  INNER JOIN `ml_article_folder` af ON af.folder_id = folder.id
                  WHERE fodler.id = ?";
    $params_link = array('i',$data['id']);
    $this->db->query($sql_link, $params_link);
  }
}



 ?>
