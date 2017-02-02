<?php
// require_once('class_mysqli.php');
/**
 * http://culttt.com/2013/02/04/how-to-save-php-sessions-to-a-database/
 */
class Session
{
  private $db;

  public function __construct()
  {
    // Instantiate new Database object
    $this->db = new Database;
    $this->create_table_if_not_exist();

    // Set handler to overide SESSION
    session_set_save_handler(
      array($this, "_open"),
      array($this, "_close"),
      array($this, "_read"),
      array($this, "_write"),
      array($this, "_destroy"),
      array($this, "_gc")
    );
    // Start the session
    session_start();
  } // end of __construct

  /**
  * Create table if not exist
  */
  private function create_table_if_not_exist(){

    $sql_create = 'CREATE TABLE IF NOT EXISTS  `ml_sessions` (
                  `id` varchar(32) COLLATE utf8_bin NOT NULL,
                  `access` int(10) unsigned DEFAULT NULL,
                  `data` text COLLATE utf8_bin,
                  PRIMARY KEY (`id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin';
    $sql_check = 'SHOW TABLES LIKE `el_sessions`';
    if ($this->db->query($sql_check)->num_rows==0){
      $this->db->query($sql_create);
    }
  }


  /**
  * Open
  */
  public function _open(){
    if($this->db){ return true; }
    return false;
  }

  /**
  * Close
  */
  public function _close(){
    if($this->db->destroy()){
      $this->db = NULL;
      return true;
    }
    return false;
  }

  /**
  * Read
  */
  public function _read($id){
    $sql = "SELECT data FROM ml_sessions WHERE id = ?";
    $param = array('s', $id);
    $result = $this->db->query($sql,$param);

    if($result){ return $result[0]['data']; }
    else{ return '';}
  }

  /**
  * Write
  */
  public function _write($id, $data){

    $access = time();
    $sql = "REPLACE INTO ml_sessions VALUES (?, ?, ?)";
    $param = array('sis', $id , $access , $data);
    if($this->db->query($sql, $param)){ return true; }
    return false;
  }

  /**
 * Destroy
 */
 public function _destroy($id){

    $sql = 'DELETE FROM ml_sessions WHERE id = ?';
    $param = array('s', $id );
    if($this->db->query($sql, $param)){ return true; }
    return false;
  }

  /**
   * Garbage Collection
   */
  public function _gc($max){
    // Calculate what is to be deemed old
    $old = time() - $max;
    $sql = 'DELETE * FROM ml_sessions WHERE access < ?';
    $param = array('i', $old );
    if($this->db->query($sql, $param)){ return true; }
    return false;
  }


}
?>
