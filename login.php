<?php
    echo 'login page';
?>

<style>
.card{
  padding: 16px;
  float: left;
  width: 250px;
  margin: 8px;
  border: 1px solid #09F;
}
.card form > input{
  width: 100%;
  display: block;
  clear: both;
  margin-bottom: 4px;
  padding: 4px;
}
</style>

<div>

<div class="card logIn">
  <h2>Signin</h2>
  <form method="post" action="/missionlife/system/ng/login.php">
    <input name="action" type="hidden" value="signin">
  <input name="username" type="username" placeholder="username">
  <input name="email" type="email" placeholder="username">
  <input name="password" type="password" placeholder="password">
  <input type="submit" value="login">
  </form>
</div>
<div class="card signIn">
  <h2>Log In</h2>
  <form method="post" action="/missionlife/system/ng/login.php">
    <input name="action" type="hidden" value="login">
  <input name="logname" type="text" placeholder="email or username">
  <input name="password" type="password" placeholder="password">
  <input type="submit" value="log in">
  </form>
</div>

</div>
