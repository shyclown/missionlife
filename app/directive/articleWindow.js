app.directive('articleWindow',['$http','Folder', 'Article', 'uploadDroppedToArticle', function($http, Folder, Article, uploadDroppedToArticle) {
  return {
    restrict: 'E',
    scope:{
      currentFolder: '=',
      openArticle: '=',
    },
    templateUrl: '/missionlife/app/template/article_window.html',
    link: function (scope, element, attrs){

      const targetUrl = '/missionlife/system/ng/upload_file.php';
      scope.header = scope.openArticle.header || 'new Header';
      scope.content = scope.openArticle.content || '';

      scope.logPanel = 'pan';
      scope.elArticleHeader = document.getElementById('articleEditorHeader');
      scope.elArticleContent = document.getElementById('articleEditorContent');
      scope.elArticleContent.value = scope.content;


      // 2. Create new Article to receive ID
      // If new Article is not created we can not upload images successfully
      // We need folder to be set otherways it doesnt work
      // TODO: make id null

      scope.insertArticle = function(){
        Article.insert(scope.edit_article, function(response){
          scope.edit_article.id = response.data;
          console.log(scope.edit_article.id);
        });
      }

      Article.Folder = { id: scope.currentFolder };
      scope.clickFolder = function(){};


      // perform when openArticle is changed
      scope.$watch(
        function(){ return scope.openArticle; },
        function(){
          console.log(scope.openArticle);
          if(scope.openArticle){
            scope.edit_article = Object.assign({},scope.openArticle);
          }
          else{
            scope.edit_article = {
              header: scope.openArticle.header || 'New Article Header',
              content: scope.openArticle.content || 'Content of Article',
              state: scope.openArticle.state || 0
            }
            console.log(scope.edit_article);
            scope.insertArticle();
          }
          // !Important : UPDATE EDITOR
          scope.area.update_content(scope.edit_article.content);
        },
      true);
      // 1. We attach editor to our template
      // - providing IDs and Link to Image Folder

      scope.area = new Editor.area({
        input_id:'articleEditorContent',
        form_id:'articleEditorForm',
        // if AngularJS
        image_url : '/missionlife/uploads/image/',
      });

      // 2. Attaching callback function executed after drop of file or image
      scope.onDropFiles = function(response){
        console.log('onDropFiles', response);
        //scope.php = scope.php + response;
        //$scope.close_editor();
        //scope.loadFilesOfArticle();
        scope.$apply();
      }

      scope.area.drop_file_callback = function(editorCallback){
        const files = event.dataTransfer.files;
        for (let i = 0, len = files.length; i < len; i++){
          let file = [files[i]];
          let area = scope.area;
          let removePlaceholder = (i == len-1);
          console.log(removePlaceholder);
          let res = uploadDroppedToArticle.bind(null, file, targetUrl,
            function(response){ },
            function(response){
              scope.onDropFiles(response);
              area.afterImageUpload(response, removePlaceholder);
            }, scope.edit_article.id )();
        }
      }


    }
  };
}]);
