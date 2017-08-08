<?php
$url = 'http://missionlife/_backend/login.php';
$root = $_SERVER['DOCUMENT_ROOT'];
require_once($root.'/define.php');
require_once($root.'/system/php/class_mysqli.php');
require_once($root.'/system/php/class_session.php');
new Session;
if(!$_SESSION){ header("Location: $url"); die('died'); }
?>
<html>
  <head>
    <base href="/_backend/">
    <!-- Angular  -->
    <script src="/angular/angular.min.js"></script>
    <script src="/angular/angular-sanitize.min.js"></script>
    <script src="/angular/angular-route.min.js"></script>
    <!-- App / Main -->
    <script src="/_backend/app.js"></script>
    <?php require $_SERVER['DOCUMENT_ROOT']."/system/php/include_files.php"; ?>
    <!-- Google Font -->
    <link href='https://fonts.googleapis.com/css?family=Raleway:400,100,200,300,500,600&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,400,600,700&amp;subset=latin-ext" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="/style/font-awesome.min.css" rel="stylesheet" type='text/css'>
    <link href="/style/luca.css" rel="stylesheet" type='text/css'>
  </head>

  <!-- LUCA APP -->
  <body ng-app="myapp">

    <div ng-controller="mainController" class="mainGrid">



      <!-- Header -->
      <div id="theHeader" class="container shadow bg-yellow">
        <div class="row space-between">
          <h1>eJoin</h1>

          <button><i class="fa fa-user-circle-o"></i></button>
        </div>
      </div>

      <!-- Left panel -->
      <div id="theLeftPanel" class="shadow">
        <ul>
          <li><a href="folders"><i class="fa fa-folder-o"></i> Files</a></li>
          <li><a href="pages"><i class="fa fa-sitemap"></i> Webpage</a></li>
          <li><a href="settings"><i class="fa fa-cog"></i> Settings</a></li>
        </ul>
      </div>

      <!-- Routed content -->
      <div id="theRoutedContent" class="ng-view">
      </div>

      <!-- Footer panel -->
      <div id="theFooter" >fsdfs
        <div ng-bind-html='php'></div>
      </div>

      <!-- Animated panel -->
      <div id="accountPanel" class="shadow">
        <ul>
          <li><a href="account"><i class="fa fa-cog"></i> Account</a></li>
          <li><a target="_self" href="/_backend/signin.php"><i class="fa fa-sign-out"></i> Logout</a></li>
        </ul>
      </div>

    </div><!--MainGrid end -->

  </body><!-- APP end -->
</html>
