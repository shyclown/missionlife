<?php
echo '<!-- App / Factory -->';
foreach (glob("app/factory/*.js") as $filename){
  echo $filename.'<br>';
  echo substr(sprintf('%o', fileperms("app/factory/")), -4);
  echo '<br>';
  echo substr(sprintf('%o', fileperms("$filename")), -4);
  echo '<br>';
}

echo '<!-- App / Factory -->';
foreach (glob("system/*") as $filename){
  echo $filename.'<br>';
  echo substr(sprintf('%o', fileperms("system")), -4);
  echo '<br>';
  echo substr(sprintf('%o', fileperms("$filename")), -4);
  echo '<br>';
}
?>
