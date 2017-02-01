<?php
//require_once('/../define.php');
// debug
mysqli_report(MYSQLI_REPORT_ALL);
class Database{
  public $_mysqli;
  private $error;
  public function __construct(){
    mysqli_report(MYSQLI_REPORT_STRICT);
    try {
      // from define.php file
      $this->_mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
      $this->_mysqli->set_charset('utf8');
    }
    catch(Exception $e){
      echo "Service unavailable";
      echo "message: " . $e->message;
      $error = $e->message;
      exit;
    }
  }
  public function select($sql_string){
    $result = $this->_mysqli->query($sql_string);
    if($result){
      $_array = array();
      while($row = $result->fetch_array(MYSQLI_ASSOC))
        { $_array[] = $row; }
      return $_array;
    }
  }
  public function query($sql_string = null, $values = null, $returning = 'array')
  {
    $return_value = false;
    if($stmt = $this->_mysqli->prepare($sql_string)){

      if($values){
        if(is_array($values)){
          if(call_user_func_array(array($stmt, 'bind_param'), $this->refValues($values))){
          };
        }
      }
      if($stmt->execute())
      {
        if($result = $stmt->get_result())
        {
          $_array = array();
          while($row = $result->fetch_array(MYSQLI_ASSOC)){
            $_array[]= $row;
          }
          if($returning == 'array'){
            $return_value = $_array;
          }
        }
        else {
          if($returning == 'get_id'){
            $return_value = $stmt->insert_id;
          }else{
            $return_value = true;
          }
        }
      } else {
        var_dump($this->_mysqli->error);
      }
      $stmt->close();
    }
    else
    {
      var_dump($this->_mysqli->error);
    }
    return $return_value;
  } // end of query
  private function refValues($arr){
    if (strnatcmp(phpversion(),'5.3') >= 0) //Reference is required for PHP 5.3+
    {
        $refs = array();
        foreach($arr as $key => $value)
            $refs[$key] = &$arr[$key];
        return $refs;
    }
    return $arr;
  }
  public function destroy(){
    $thread_id = $this->_mysqli->thread_id;
    $this->_mysqli->kill($thread_id);
    $this->_mysqli->close();
  }
}
