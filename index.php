<?php
$url = 'http://localhost/missionlife/login.php';
$root = $_SERVER['DOCUMENT_ROOT']."/missionlife";
require_once($root.'/system/php/define.php');
require_once($root.'/system/php/class_mysqli.php');
require_once($root.'/system/php/class_session.php');
new Session;
if(!$_SESSION){ header("Location: $url"); die('died'); }
else{}
?>
<html>
  <head>
    <base href="/missionlife/">
<!-- Angular  -->
    <script src="/missionlife/angular/angular.min.js"></script>
    <script src="/missionlife/angular/angular-sanitize.min.js"></script>
    <script src="/missionlife/angular/angular-route.min.js"></script>
<!-- App / Main -->
    <script src="/missionlife/app.js"></script>
    <?php require $_SERVER['DOCUMENT_ROOT']."/missionlife/system/php/include_files.php"; ?>
<!-- Google Font -->
    <link href='https://fonts.googleapis.com/css?family=Raleway:400,100,200,300,500,600&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,400,600,700&amp;subset=latin-ext" rel="stylesheet">
<!-- Font Awesome -->
<link href="style/font-awesome.min.css" rel="stylesheet" type='text/css'>

<style>
  #menuLeft{
    position: fixed;
    height: calc(100% - 64px);
    overflow-y: scroll;
    z-index: 5;
    top: 64px;
    width: 240px;
    background-color: #999;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  ul{
    list-style: none;
    margin: 0px;
    padding: 0px;
  }
  ul li > a{
    display: block;
    padding: 8px 16px;
    background-color: #FFF;
    border-bottom: 1px solid #E0E0E0;
    text-decoration: none;
    color: #666;
  }
  ul li > a{
    display: block;
    padding: 8px 16px;
    background-color: #FFF;
    border-bottom: 1px solid #E0E0E0;
  }
  </style>

  </head>
  <body ng-app="myapp">

    <div ng-controller="mainController">
    <!-- info from php errors -->


    <nav id="topnav" class="shadow">
      <ul>
        <li><h1>{{page.page_name}}</h1></li>


        <!-- Removed
        Same as Folders in new versions
        <li><a href="home">Home</a></li>
        <li><a href="settings">Settings</a></li>
        <li><a href="folders">Folders</a></li>
                <li><a href="garant">Garant</a></li>
        <li><a href="form">Forms</a></li>
        <li><a href="files">Files</a></li>
         <li><a href="article">Article</a></li>
        -->

      </ul>

    </nav>
    <div id="menuLeft" class="shadow">
    <ul>
      <li><a href="folders"><i class="fa fa-folder-o"></i> Files</a></li>
      <li><a href="pages"><i class="fa fa-sitemap"></i> Webpage</a></li>
      <li><a href="settings"><i class="fa fa-cog"></i> Settings</a></li>
    </ul>
    <p>This editor was created 2016</p>

    </div>
    <div class="ng-view">
      <!-- content -->
    </div>
    <div class="notes">
      <!-- notes -->
      <div ng-bind-html='php'></div>

    </div>
  </div>
  </body>
</html>
