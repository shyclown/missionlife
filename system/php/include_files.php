<?php


// Include FILES

echo '<!-- Editor -->';
foreach (glob('../el_editor/*.js') as $filename) { echo '<script src="'.$filename.'"></script>'; }
foreach (glob('../el_editor/style/*.css') as $filename) { echo '<link href="'.$filename.'" rel="stylesheet" type="text/css">'; }

echo '<!-- App / CSS -->';

// CSS Files

// foreach (glob("../style/css/*.css") as $filename){ echo '<link href="'.$filename.'" rel="stylesheet" type="text/css">';}
// foreach (glob("../style/pages/*.css") as $filename){ echo '<link href="'.$filename.'" rel="stylesheet" type="text/css">';}

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

$css_universal = getPathsToType("../style/css/universal/", 'css');
$css_backend = getPathsToType("../style/css/backend/", 'css');

// CSS UNIVERSAL
foreach ($css_universal as $path) {
echo '<link href="'.$path.'" rel="stylesheet" type="text/css">';
}
// CSS BACKEND
foreach ($css_backend as $path) {
echo '<link href="'.$path.'" rel="stylesheet" type="text/css">';
}


echo '<!-- App / Service -->';
foreach (glob("app/service/*.js") as $filename){ echo '<script src="'.$filename.'"></script>';}

echo '<!-- App / Factory -->';
foreach (glob("app/factory/*.js") as $filename){ echo '<script src="'.$filename.'"></script>';}

echo '<!-- App / Directive -->';
foreach (glob("app/directive/*.js") as $filename){ echo '<script src="'.$filename.'"></script>';}

echo '<!-- App / Directive Explorer -->';
foreach (glob("app/directive/explorer/*.js") as $filename){ echo '<script src="'.$filename.'"></script>';}

echo '<!-- App / Directive Explorer -->';
foreach (glob("app/directive/popup/*.js") as $filename){ echo '<script src="'.$filename.'"></script>';}

echo '<!-- App / Directive Explorer -->';
foreach (glob("app/directive/window/*.js") as $filename){ echo '<script src="'.$filename.'"></script>';}

echo '<!-- App / Controller -->';
foreach (glob("app/controller/*.js") as $filename){ echo '<script src="'.$filename.'"></script>';}
