<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>articleEditor</title>



    <!-- Angular  -->

    <!-- App / Main -->

    <!-- INCLUDE FILES -->
    <?php require $_SERVER['DOCUMENT_ROOT']."/system/php/include_files.php"; ?>

    <!-- Google Font -->
    <link href='https://fonts.googleapis.com/css?family=Raleway:400,100,200,300,500,600&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,400,600,700&amp;subset=latin-ext" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="/style/font-awesome.min.css" rel="stylesheet" type='text/css'>
    <link href="/style/luca.css" rel="stylesheet" type='text/css'>

    <style >

    </style>


  </head>
  <body>


<div class="blanket" ng-click="cancel()">
  <div class="window bg-white shadow" ng-click="$event.stopPropagation()">
    <div class="header bg-yellow row v-center space-between pl-1">
      Article editor
      <button class="x-close bg-white" ng-click="cancel()"><i class="fa fa-times"></i></button>
    </div>
    <div class="content">
      <div id="articleGrid">
        <div>
        <form id="articleEditorForm" class="ng-pristine ng-valid">
        <input id="articleEditorHeader" class="fullwidth articleHeader ng-pristine ng-untouched ng-valid ng-not-empty" placeholder="Article Header" ng-model="article.header">
        <div class="editor_wrap"><div class="ctrl_btns"><button class="intLink" type="button" title="Remove_formating"><i class="fa fa-paragraph fa-fw"></i></button><button class="intLink" type="button" title="Header_H2"><i class="fa fa-header fa-fw"></i></button><button class="intLink" type="button" title="Bold"><i class="fa fa-bold fa-fw"></i></button><button class="intLink" type="button" title="Italic"><i class="fa fa-italic fa-fw"></i></button><button class="intLink" type="button" title="Underline"><i class="fa fa-underline fa-fw"></i></button><button class="intLink" type="button" title="Align left"><i class="fa fa-align-left fa-fw"></i></button><button class="intLink" type="button" title="Align center"><i class="fa fa-align-center fa-fw"></i></button><button class="intLink" type="button" title="Align right"><i class="fa fa-align-right fa-fw"></i></button><button class="intLink" type="button" title="Align full"><i class="fa fa-align-justify fa-fw"></i></button><button class="intLink" type="button" title="Numbered list"><i class="fa fa-list-ol fa-fw"></i></button><button class="intLink" type="button" title="Dotted list"><i class="fa fa-list-ul fa-fw"></i></button><button class="intLink" type="button" title="Quote"><i class="fa fa-quote-right fa-fw"></i></button><button class="intLink" type="button" title="Hyperlink"><i class="fa fa-link fa-fw"></i></button><button class="intLink" type="button" title="Code"><i class="fa fa-code fa-fw"></i></button></div><div class="content_wrap" contenteditable="true"><p>Confdsfsdfsd</p><figure class="image" contenteditable="false"><img src="http://missionlife/uploads/image/5915e285e3a09.png"><figcaption class="figure_text" contenteditable="true">5915d551704e9.png</figcaption><div class="icon_btn moveBtn"><i class="icon fa fa-arrows"></i></div><div class="icon_btn deleteBtn"><i class="icon fa fa-times"></i></div></figure>tent<p></p><figure class="image" contenteditable="false"><img src="http://missionlife/missionlife/uploads/image/5915588b23e45.png"><figcaption class="figure_text" contenteditable="true">new item</figcaption><div class="icon_btn moveBtn"><i class="icon fa fa-arrows"></i></div><div class="icon_btn deleteBtn"><i class="icon fa fa-times"></i></div></figure><figure class="image" contenteditable="false"><img src="http://missionlife/missionlife/uploads/image/591558c5c7cc1.png"><figcaption class="figure_text" contenteditable="true">new item</figcaption><div class="icon_btn moveBtn"><i class="icon fa fa-arrows"></i></div><div class="icon_btn deleteBtn"><i class="icon fa fa-times"></i></div></figure><figure class="image" contenteditable="false"><img src="http://missionlife/missionlife/uploads/image/591558bd3acee.png"><figcaption class="figure_text" contenteditable="true">new item</figcaption><div class="icon_btn moveBtn"><i class="icon fa fa-arrows"></i></div><div class="icon_btn deleteBtn"><i class="icon fa fa-times"></i></div></figure></div><div class="switch_wrap"><input class="switch_el" type="checkbox" name="switchMode"><label class="switch_label" for="switchMode">Show HTML</label></div></div><input id="articleEditorContent" class="articleContent ng-pristine ng-untouched ng-valid ng-not-empty" placeholder="Article Content" ng-model="article.content" type="hidden" value="%3Cp%3EConfdsfsdfsd%3C%2Fp%3E%3Cfigure%20class%3D%22image%22%20contenteditable%3D%22false%22%3E%3Cimg%20src%3D%22http%3A%2F%2Fmissionlife%2Fuploads%2Fimage%2F5915e285e3a09.png%22%3E%3Cfigcaption%20class%3D%22figure_text%22%20contenteditable%3D%22true%22%3E5915d551704e9.png%3C%2Ffigcaption%3E%3C%2Ffigure%3Etent%3Cp%3E%3C%2Fp%3E%3Cfigure%20class%3D%22image%22%20contenteditable%3D%22false%22%3E%3Cimg%20src%3D%22http%3A%2F%2Fmissionlife%2Fmissionlife%2Fuploads%2Fimage%2F5915588b23e45.png%22%3E%3Cfigcaption%20class%3D%22figure_text%22%20contenteditable%3D%22true%22%3Enew%20item%3C%2Ffigcaption%3E%3C%2Ffigure%3E%3Cfigure%20class%3D%22image%22%20contenteditable%3D%22false%22%3E%3Cimg%20src%3D%22http%3A%2F%2Fmissionlife%2Fmissionlife%2Fuploads%2Fimage%2F591558c5c7cc1.png%22%3E%3Cfigcaption%20class%3D%22figure_text%22%20contenteditable%3D%22true%22%3Enew%20item%3C%2Ffigcaption%3E%3C%2Ffigure%3E%3Cfigure%20class%3D%22image%22%20contenteditable%3D%22false%22%3E%3Cimg%20src%3D%22http%3A%2F%2Fmissionlife%2Fmissionlife%2Fuploads%2Fimage%2F591558bd3acee.png%22%3E%3Cfigcaption%20class%3D%22figure_text%22%20contenteditable%3D%22true%22%3Enew%20item%3C%2Ffigcaption%3E%3C%2Ffigure%3E">
      </form></div>
      <div>
        <ul class="pt-1 pb-1">
          <li><button class="fullwidth" id="articleSubmitButton" type="submit" ng-click="saveChanges()"><i class="fa fa-save"></i> Save </button></li>
          <li><button class="fullwidth" ng-click="deleteArticle()"><i class="fa fa-trash-o"></i> Delete </button></li>
        </ul>
        <ul>
          <li><button class="fullwidth txt-left" ng-click="selectFilePop()"><i class="fa fa-file"></i> File</button></li>
          <li><button class="fullwidth txt-left" ng-click="selectArticlePop()"><i class="fa fa-file-text-o"></i> Article</button></li>
          <li><button class="fullwidth txt-left" ng-click="selectImagePop()"><i class="fa fa-image"></i> Image</button></li>
          <li><button class="fullwidth txt-left" ng-click="editYoutubeLinkPop()"><i class="fa fa-youtube-play"></i> Youtube video</button></li>
          <li><button class="fullwidth txt-left" ng-click="editWebLinkPop()"><i class="fa fa-link"></i> Web Link</button></li>
          <li><button class="fullwidth txt-left" ng-click="selectPagePop()"><i class="fa fa-sitemap"></i> Page Link</button></li>
        </ul>

      </div>
    </div>
    </div>
    <div class="tooltab">
      log panel
    </div>
  </div>
</div>




  </body>
</html>
