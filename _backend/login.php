<?php require "head.php"; ?>

<div class="flex fill gray">
  <div class="pa-1 white shadow">
    <h2>Log In</h2>
    <form class="mt-1" method="post" action="/system/ng/login.php">
      <input name="action" type="hidden" value="login">
      <input name="logname" type="text" placeholder="email or username">
      <input name="password" type="password" placeholder="password">
      <input type="submit" value="log in">
    </form>
  </div>
</div>

<?php require "footer.php"; ?>
