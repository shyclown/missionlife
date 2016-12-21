<?php
echo '<!-- Editor -->';
foreach (glob('el_editor/*.js') as $filename) { echo '<script src="'.$filename.'"></script>'; }
foreach (glob('el_editor/style/*.css') as $filename) { echo '<link href="'.$filename.'" rel="stylesheet" type="text/css">'; }
echo '<!-- App / CSS -->';
foreach (glob("style/css/*.css") as $filename){ echo '<link href="'.$filename.'" rel="stylesheet" type="text/css">';}
foreach (glob("style/pages/*.css") as $filename){ echo '<link href="'.$filename.'" rel="stylesheet" type="text/css">';}
echo '<!-- App / Service -->';
foreach (glob("app/service/*.js") as $filename){ echo '<script src="'.$filename.'"></script>';}
echo '<!-- App / Factory -->';
foreach (glob("app/factory/*.js") as $filename){ echo '<script src="'.$filename.'"></script>';}
echo '<!-- App / Directive -->';
foreach (glob("app/directive/*.js") as $filename){ echo '<script src="'.$filename.'"></script>';}
echo '<!-- App / Controller -->';
foreach (glob("app/controller/*.js") as $filename){ echo '<script src="'.$filename.'"></script>';}
