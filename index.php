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
  </head>
  <body ng-app="myapp">

    <div ng-controller="mainController">
    <!-- info from php errors -->
    <div ng-bind-html='php'></div>
    <img src="bg.jpg" id="bg" alt="">
    <nav id="topnav">
      <ul>
        <li><h1>{{page.name}}</h1></li>
        <li><a href="home">Home</a></li>
        <li><a href="settings">Settings</a></li>
        <li><a href="garant">Garant</a></li>
        <li><a href="article">Article</a></li>
        <li><a href="files">Files</a></li>
        <li><a href="folders">Folders</a></li>
      </ul>
    </nav>
    <div class="ng-view">
      <!-- content -->
    </div>
    <div class="notes">
      Notes:

    </div>
  </div>
  </body>
</html>
