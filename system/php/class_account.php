<?php

class Account
{
  private $id;
  private $username;
  private $email;
  private $password;

  function __construct(){
    $this->db = new Database;
    $this->errors = [];
  }
  /* Create Table */


  // public: SIGN IN, LOGIN, DELETE

  public function sign_in(){
    $this->load_post_values();
    $this->check_values();
    if(empty($this->errors)){
      $this->create_account(); return true;}
    else{ return false; }
  }

  public function login(){
    // logname can be email or username
  $this->logname = $_POST['logname'];
  $this->password = $_POST['password'];
    if($this->find_account()){ $this->make_session();
     return true;
    }
    else{ return false; }
  }

  public function delete(){
  $this->user_id = $_SESSION['user_id'];
  $sql = "DELETE FROM `ml_account` WHERE id = ?";
  $params = array('i', $this->user_id);
  $result = $db->query($sql, $params);
  }

  public function load_signed(){
  if(isset($_SESSION['user_id'])){
    $id = $_SESSION['user_id'];
    $sql = "SELECT * FROM `ml_account` WHERE `id` = ?";
    $params = array("i",$id);
    $result = $this->db->query($sql,$params);
    if(!empty($result)){
      $this->id = $result[0]['id'];
      $this->username = $result[0]['username'];
      $this->email = $result[0]['email'];
      }
    }
    else { array_push($this->errors, 'Account does not exists'); }
  }
  private function load_post_values(){
    $this->username = $_POST['username'];
    $this->email = $_POST['email'];
    $this->password = $this->generate_hash($_POST['password']);
    // $this->salt = $_POST['password']; testing
  }

  /* Check values */

  public function check_email(){
    if(isset($_POST) && $_POST != ''){
      $this->email = $_POST['email'];
      if($this->is_valid('email')){
        if($this->is_free('email')){
          echo 'email is ok';
        }
        else{ echo 'email is not free'; }
      }
      else{
        echo 'not valid email';
      }
    }
  }

  public function is_valid($column)
  {
    if($column == 'email'){ return filter_var(  $this->email, FILTER_VALIDATE_EMAIL); }
    if($column == 'username'){ return preg_match('/^[A-Za-z][A-Za-z\d_.-]{5,31}$/i', $this->username); }
  }

  public function is_free($column)
  {
    if($column == 'email'){ $value = $this->email; }
    if($column == 'username'){ $value = $this->username; }
    $sql = "SELECT * FROM `ml_account` WHERE ? = ?";
    $params = array('ss', $column, $value);
    $result = $this->db->query($sql, $params);
    if($result){ return false; }
    return true;
  }

  public function list_all()
  {
    $sql = "SELECT * FROM `ml_account`";
    $result = $this->db->select($sql);
    return $result;
  }

  private function valid_password($input, $hashed)
  {
    return crypt($input, $hashed) == $hashed;
  }

  private function generate_hash($password, $cost = 11)
  {
    $salt= substr(base64_encode(openssl_random_pseudo_bytes(17)),0,22);
    $salt= str_replace("+",".",$salt);
    $param='$'.implode('$',array("2y", str_pad($cost,2,"0",STR_PAD_LEFT), $salt));
    return crypt($password,$param);
  }

  private function check_values()
  {
    if(!isset($this->email) || $this->email == ''){
      array_push($this->errors,'email not set');}
    if(!$this->is_valid('email')){
      array_push($this->errors,'email writen wrong');}
    if(!$this->is_free('email')){
      array_push($this->errors,'email already used by someone else');}

    if(!isset($this->username) || $this->username == ''){
      array_push($this->errors,'username not set');}
    if(!$this->is_valid('username')){
      array_push($this->errors,'username is not valid');}
    if(!$this->is_free('username')){
      array_push($this->errors,'username already used by someone else');}
  }

  private function create_account()
  {
    $sql = "INSERT INTO `ml_account` (`id`, `username`, `password`, `email`, `state`,`date_created`,`date_edited`) VALUES (NULL, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);";
    $params = array('sss', $this->username , $this->password , $this->email);
    $result = $this->db->query($sql, $params);
    echo 'user created';
  }

  private function find_account()
  {
    $sql = "SELECT * FROM `ml_account` WHERE `username` = ? OR `email` = ?";
    $params = array("ss", $this->logname ,$this->logname);
    $result = $this->db->query($sql, $params);
    if(!empty($result))
    {
      if($this->valid_password($this->password, $result[0]['password']))
      {
        $this->id = $result[0]['id'];
        $this->username = $result[0]['username'];
        $this->email = $result[0]['email'];
        return true;
      }
      else
      {
        return false;
      }
    }
  }

  private function make_cookie()
  {
    if(!setcookie('elephant-id',session_id(),strtotime( '+30 days' ), "/", NULL)){
      echo 'cookie not made';
    };
  }

  private function make_session()
  {
    $_SESSION["user_id"] = $this->id;
    $_SESSION["username"] = $this->username;
    $_SESSION["loged_in"] = true;
  }

  public function is_valid_cookie()
  {
    $sql = "SELECT * FROM `ml_sessions` WHERE `id` = ? LIMIT 1";
    $params = array('s', $_COOKIE['missionlife-id']);
    $result = $this->db->query($sql, $params);
    $data = $result[0]['data'];
    if(session_decode ( $data ))
    {
    return true;
    }
    return false;
  }



}
?>
