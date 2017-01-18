/* Uses Editor */

app.directive('articleWindow',['$http','Folder', 'Article', 'uploadDroppedToArticle', function($http, Folder, Article, uploadDroppedToArticle) {
  return {
    restrict: 'E',
    scope:{ currentFolder: '=', openArticle: '=' },
    templateUrl: '/missionlife/app/template/article_window.html',
    link: function (scope, element, attrs)
    {
      const targetUrl = '/missionlife/system/ng/upload_file.php';
      scope.header = scope.openArticle.header || 'new Header';
      scope.content = scope.openArticle.content || '';
      scope.logPanel = 'log panel';
      scope.elArticleHeader = document.getElementById('articleEditorHeader');
      scope.elArticleContent = document.getElementById('articleEditorContent');
      scope.elArticleContent.value = scope.content;

      // 2. Create new Article to receive ID
      // If new Article is not created we can not upload images successfully
      // We need folder to be set otherways it doesnt work
      // TODO: make id null

      scope.files = {};

      // perform when openArticle is changed
      scope.$watch(
        function(){ return scope.openArticle; },
        function(){
          // If article is clicked then there is openArticle Object presenet
          // otherways it is set to false and new Article is inserted
          /* This needs to be done because of uploading files, Which id is stored to Article <-> File
            connecting table, to alow reuse of same image on page */
          Article.Folder = { id: scope.currentFolder };
          if(scope.openArticle)
          {
            scope.edit_article = Object.assign({},scope.openArticle);
            scope.area.update_content(scope.edit_article.content);
            Editor.attachImageControls.bind(scope.area)();
            scope.loadFilesOfArticle();
          }
          else{
            scope.edit_article = {
              header: scope.openArticle.header || 'New Article Header',
              content: scope.openArticle.content || 'Content of Article',
              state: scope.openArticle.state || 0
            }
            Article.insert(scope.edit_article,
              function(response){
                scope.logPanel = response.data;
                scope.edit_article.id = response.data;
                scope.area.update_content(scope.edit_article.content);
                Editor.attachImageControls.bind(scope.area)();
                scope.loadFilesOfArticle();
              }
            );
          }
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
      scope.updateFiles = function(files){ scope.files = files; }
      scope.loadFilesOfArticle = function(){
        Article.load_files(scope.edit_article, function(response){
          scope.updateFiles(response.data);
        });
      }
      // 2. Attaching callback function executed after drop of file or image
      scope.onDropFiles = function(response){
        console.log('onDropFiles', response);
        //scope.php = scope.php + response;
        //$scope.close_editor();
        //scope.loadFilesOfArticle();
      }
      scope.area.drop_file_callback = function(editorCallback){
        const files = event.dataTransfer.files;
        for (let i = 0, len = files.length; i < len; i++){
          let file = [files[i]];
          let area = scope.area;
          let removePlaceholder = (i == len-1);
          console.log('remove placeholder', removePlaceholder);
          let res = uploadDroppedToArticle.bind(null, file, targetUrl, function(response){},
            function(response){
              scope.onDropFiles(response);
              area.afterImageUpload(response, removePlaceholder);
              scope.loadFilesOfArticle();
              scope.saveChanges();
            }, scope.edit_article.id )();
        }
      }
      scope.saveChanges = function(){
        Editor.removeImageControls.bind(scope.area)();
        scope.edit_article.content = scope.area.part.content_wrap.innerHTML;
        Article.update(scope.edit_article, function(response){
          scope.logPanel = response.data;
        });
        Editor.attachImageControls.bind(scope.area)();
      }
    }
  };
}]);
