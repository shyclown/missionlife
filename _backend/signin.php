<?php require "head.php"; ?>

<div class="flex fill gray">
  <div class="pa-1 white shadow">
    <h2>Sign In</h2>
    <form class="mt-1" method="post" action="/system/ng/login.php" autocomplete="off">
      <input name="action" type="hidden" value="signin">
      <input name="username" type="username" placeholder="username">
      <input name="email" type="email" placeholder="email">
      <input name="password" type="password" placeholder="password">
      <input type="submit" value="register">
    </form>
  </div>
</div>

<?php require "footer.php"; ?>
