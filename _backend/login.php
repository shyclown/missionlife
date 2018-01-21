<?php require "head.php"; ?>
<style media="screen">
  /*hotfix*/
  .login{
    font-family: 'Source Sans Pro', sans-serif;
    font-smooth: auto;
    padding: 1rem;
    width: 250px;
    margin: 0 auto;
    background-color: #EAEAEA;
  }
  .login input{
    margin-bottom: 1rem;
    box-sizing: border-box;
    padding: 0.5rem;
    width: 100%;
  }
  .login input[type="submit"]{
    padding: 0.5rem;
    margin: 0;
    float: right;
  }
  .login h2{
    font-family: 'Source Sans Pro', sans-serif;
    font-smooth: auto;
    font-weight: 100;
  }
  .login div.info{
    background: #EE8;
    box-sizing: border-box;
    padding: 0.5rem;
    margin-bottom: 1rem;
  }
  .login .clr{
    clear: both;
  }
</style>
<div class="login">
  <div class="">
    <h2>Log In</h2>
    <form class="mt-1" method="post" action="/system/ng/login.php">
      <input name="action" type="hidden" value="login">
      <input name="logname" type="text" placeholder="email or username">
      <input name="password" type="password" placeholder="password">
      <div class="info">
      This web page is going to use COOKIES. By pressing login button you agree with use of COOKIES in your browser.
      </div>

      <input type="submit" value="LOG IN" />
  </form>
  <div class="clr"></div>
  </div>
</div>

<?php require "footer.php"; ?>
