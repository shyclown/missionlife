<html>
  <head>
    <base href="/_frontend/">
<!-- Angular  -->
    <script src="/angular/angular.min.js"></script>
    <script src="/angular/angular-sanitize.min.js"></script>
    <script src="/angular/angular-route.min.js"></script>
<!-- App / Main -->
    <script src="app.js"></script>
<?php

echo '<!-- App / Controllers -->';
foreach (glob("app/controllers/*.js") as $filename){
  echo '<script src="'.$filename.'" ></script>';
}
echo '<!-- App / Service -->';
foreach (glob("app/service/*.js") as $filename){
  echo '<script src="'.$filename.'" ></script>';
}
echo '<!-- App / Factory -->';
foreach (glob("app/factory/*.js") as $filename){
  echo '<script src="'.$filename.'" ></script>';
}
?>
<?php
echo '<!-- App / CSS -->';
foreach (glob("style/*.css") as $filename){
  echo '<link href="'.$filename.'" rel="stylesheet" type="text/css">';
}
?>
<!-- Google Font -->
    <link href='https://fonts.googleapis.com/css?family=Raleway:400,100,200,300,500,600&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,400,600,700&amp;subset=latin-ext" rel="stylesheet">
<!-- Font Awesome -->
<link href="/style/font-awesome.min.css" rel="stylesheet" type='text/css'>

<link rel="shortcut icon" href="http://www.missionlife.sk/mission.ico"/>
<meta name="description" content="Občianske združenie Mission Life">
<meta name="author" content="Mission Life">
<meta name="keywords" content="Občianske, Združenie, Nadácia, Pomoc, 2%, Mission Life, obcianske, zdruzenie, nadacia, dar">
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>OZ Mission Life</title>


</head>
