app.controller('articleController',function($scope, $compile, $http, Folder, Article, uploadDroppedToArticle){

  const targetUrl = '/missionlife/system/ng/upload_file.php';

  const ajax = function(data, url, completeFn, errorFn){
    $http({ method: 'POST', url: url, data:data })
    .then( completeFn, errorFn );
  }
  //-----------------------------------------------------
  // List Folders
  //-----------------------------------------------------

  $scope.$watch(
    function(){ return Folder.allFolders; },
    function(){ $scope.folders = Folder.allFolders;},
  true);

  $scope.current_folder = null;
  $scope.current_parents = [];

  $scope.openFolder = function(folder){
    $scope.current_folder = folder;
    Article.Folder = folder;
    $scope.current_parents = Folder.listParents(folder);
    Article.load();
  }
  Folder.select_all();

  //-----------------------------------------------------
  // Article Ajax Functions
  //-----------------------------------------------------

  $scope.$watch(
    function(){ return Article.selected; },
    function(){
      $scope.articles = Article.selected;
      $scope.all_rows = Article.all_rows;
  }, true);

  $scope.insertArticle = function(){
    Article.insert($scope.edit_article, function(response){
      $scope.edit_article.is_new = false;
      $scope.edit_article.id = response.data;
      Article.load();
    });
  }
  $scope.updateArticle = function(article){
    Article.update( article, function(response){
        Article.load();
        $scope.close_editor();
    });
  }
  $scope.deleteArticle = function(article){
      stopDefault(event);
      Article.delete(article, function(response){
        Article.load();
    });
  }
  //-----------------------------------------------------
  // Files
  //-----------------------------------------------------
  $scope.drag_file_item = {};
  $scope.isDraggingFile = false;

  $scope.dragFileItem = function(file, el){
    $scope.isDraggingFile = true;
    $scope.drag_file_item = {file, el};
  }

  $scope.deleteFile = function(file){
    let data = file;
    data.action = 'deleteFile';
    ajax(data, fileUrl, function(response){
      loadFilesOfArticle()
      },
      defError
    );
  }

  //-----------------------------------------------------
  // Text Area
  //-----------------------------------------------------

  $scope.area = '';

  $scope.$on('$routeChangeSuccess', function() {
    $scope.area = new Editor.area({
      input_id:'inputArea',
      form_id:'formArea',
      // if AngularJS
      image_url : '/missionlife/uploads/image/',
    });
  });

  $scope.open_editor = function(openArticle){
    $scope.edit_article = Object.assign({}, openArticle);
    if(openArticle.is_new){ $scope.insertArticle(); }
    else{ $scope.loadFilesOfArticle(); }

    $scope.area.part.content_wrap.innerHTML = $scope.edit_article.content;
    Editor.attachImageControls.bind($scope.area)();

    $scope.area.drop_file_callback = function(editorCallback){
      const files = event.dataTransfer.files;
      for (let i = 0, len = files.length; i < len; i++){
        let file = [files[i]];  let area = $scope.area;   let removePlaceholder = (i == len-1);
        uploadDroppedToArticle.bind(null, file, targetUrl, function(response){ },
          function(response){
            $scope.onDropFiles(response);
            area.afterImageUpload(response, removePlaceholder);
          }, $scope.edit_article.id   )();
      }
    }
    $scope.article_editor = true;
  } // $scope.open_editor

  $scope.close_editor = function(){
    $scope.article_editor = false;
  }

  $scope.saveArticle = function(article){
    // Update content of editor , which is not binded
    Editor.removeImageControls.bind($scope.area)(); // remove editors controls
    article.content = $scope.area.part.content_wrap.innerHTML;
    $scope.updateArticle(article);
  }

  var selected = $scope.new_article;
  $scope.article_editor = false;
  $scope.article_files = false;

  $scope.php = '';

  $scope.onDropFiles = function(response){
    console.log('onDropFiles', response);
    $scope.php = $scope.php + response;
    //$scope.close_editor();
    $scope.loadFilesOfArticle();
    $scope.$apply();
  }
  $scope.selectedFiles = function(event){
  }


  //-----------------------------------------------------
  // Prompt
  //-----------------------------------------------------

  $scope.prompt = function(message, no, yes, fn){
    const HTMLbody = angular.element(document.body);
    const appendHtml = $compile('<prompt message="'+message+'" no="'+no+'" yes="'+yes+'" promptfn="'+fn+'"></prompt>')($scope);
    HTMLbody.append(appendHtml);
  }
  $scope.prompt_hi = function(fn){
    $scope.prompt('Do you really want to close this', 'i do not like it', 'i like it', fn )
  }

  //-----------------------------------------------------
  // File Editor
  //-----------------------------------------------------

  $scope.openFileEditor;
  $scope.editFile = {};

  $scope.startEditFile = function(file){
    $scope.editFile = file;
    $scope.editFile.new_file_desc = $scope.editFile.file_desc;
    $scope.openFileEditor = true;
  }
  $scope.cancelEditFile = function(){
    $scope.openFileEditor = false;
    $scope.editFile = {};
  }
  $scope.storeNewName = function(){
    let data = {
      file_desc: $scope.editFile.new_file_desc,
      file_id: $scope.editFile.id,
      article_id: $scope.edit_article.id,
    };
    Article.updateFileDesc(data, function(response){
      $scope.editFile.file_desc = $scope.editFile.new_file_desc;
      $scope.cancelEditFile();
    });
  }

  //-----------------------------------------------------
  // Sub-Category Smaller Font
  //-----------------------------------------------------

  $scope.loadFilesOfArticle = function(){
    Article.load_files({
      article_id: $scope.edit_article.id
    }, function(response){
      $scope.article_files = response.data;
      console.log(response);
    });
  }
  $scope.megaBytes = function(value){
    let mb = 1024*1024;
    mb = value/mb;
    return Math.round(mb*100)/100;
  }

  $scope.new_article = {
    is_new: true,
    header: "New Header",
    content: "<p>Content</p>",
    state: 1
  }
  $scope.articles = [];
  $scope.next_page = function(){

  };
  Article.load();




});
