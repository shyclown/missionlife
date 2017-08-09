<html>
  <head>
    <!-- INCLUDE CSS -->
    <?php

    // include all css files from selected subdirectory
    function listAllFrom($folder, $folders){
      foreach (glob($folder, GLOB_ONLYDIR) as $dir) {
        $folders[] = $dir;
        $folders = listAllFrom($dir."/*", $folders);
      }
      return $folders;
    }

    function getPathsToType($folder, $type){
      $folder =  $folder."*";
      $files = array();
      $folders = array();

      $folders = listAllFrom($folder, $folders);

      foreach (glob($folder.".".$type) as $filename){
        $files[] = $filename;
      }

      foreach ($folders as $subfolder) {
        $path = $subfolder."/*.".$type;

        foreach (glob($path) as $filename){
          $files[] = $filename;
        }
      }
      return $files;
    }

    $css_universal = getPathsToType("../../style/css/universal/", 'css');
    $css_backend = getPathsToType("../../style/css/backend/", 'css');


    // CSS UNIVERSAL
    foreach ($css_universal as $path) {
    echo '<link href="'.$path.'" rel="stylesheet" type="text/css">';
    }
    // CSS BACKEND
    foreach ($css_backend as $path) {
    echo '<link href="'.$path.'" rel="stylesheet" type="text/css">';
    }
    ?>

    <!-- Google Font -->
    <link href='https://fonts.googleapis.com/css?family=Raleway:400,100,200,300,500,600&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,400,600,700&amp;subset=latin-ext" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="/style/font-awesome.min.css" rel="stylesheet" type='text/css'>
    <link href="/style/luca.css" rel="stylesheet" type='text/css'>
  </head>

  <!-- LUCA APP -->
  <?php
  if(isset($_GET["path"])){
    $path = $_SERVER['DOCUMENT_ROOT']."/_backend/app/template/".$_GET["path"];
    echo $path;
    require $path;
  }else{
  ?>

  <h1>CSS TEST - WINDOW</h1>
  <div class="column">
  <a href="?path=/window/edit_article_window.html">edit_article_window</a>
  <a href="?path=/window/edit_file_window.html">edit_file_window</a>
  <a href="?path=/window/edit_folder_window.html">edit_folder_window</a>
  <a href="?path=/window/edit_form_window.html">edit_form_window</a>
  <a href="?path=/window/edit_garant_window.html">edit_garant_window</a>
  </div>
  <h1>CSS TEST - POPUP</h1>
  <div class="column">
  <a href="?path=/popup/pop_edit_page.html">pop_edit_page</a>
  <a href="?path=/popup/pop_select_page.html">pop_select_page</a>
  <a href="?path=/popup/pop_select.html">pop_select</a>
  <a href="?path=/popup/pop_edit_web_link.html">pop_edit_web_link</a>
  </div>
  <?php  }  ?>

  </body><!-- APP end -->
</html>
