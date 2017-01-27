/* Uses Editor */

app.directive('articleWindow',['$http','Folder', 'Article', 'Form', 'uploadDroppedToArticle', function($http, Folder, Article, Form, uploadDroppedToArticle) {
  return {
    restrict: 'E',
    scope:{ currentFolder: '=', openArticle: '=', articleWindow :'=' },
    templateUrl: '/missionlife/app/template/article_window.html',
    link: function (scope, element, attrs)
    {
      // url to place which handles file upload to article
      const targetUrl = '/missionlife/system/ng/upload_file.php';
      scope.header = scope.openArticle.header || 'new Header';
      scope.content = scope.openArticle.content || 'new Content';
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
          Article.Folder = scope.currentFolder;
          if(scope.openArticle)
          {
            scope.edit_article = Object.assign({},scope.openArticle);
            scope.area.update_content(scope.edit_article.content);
            Editor.attachImageControls.bind(scope.area)();
            scope.loadFilesOfArticle();
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

      scope.loadFilesOfArticle = function(){
        // When page is loaded article.id value doesnt exist
        // We do not load files in this case, no errors
        /* Before: If we try load files we get error of missing data.id */
        if(scope.openArticle.id){
          Article.load_files( scope.edit_article, function(response){
            // Update scope files
            scope.files = response.data;
            console.dir(response.data);
          });
        }
      }
      // Article state
      scope.stateText = function(){
        if(scope.edit_article && scope.edit_article.state){ return 'dectivate'; }
        else{ return 'activate'; }
      }
      scope.changeState = function(){
        scope.edit_article.state = !scope.edit_article.scope;
        //scope.buttonText = scope.stateText();
      }

      scope.closeWithoutSave = function(){
        scope.articleWindow = false;
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
        let sel = document.getSelection();

        console.log('selection', sel);
        Editor.removeImageControls.bind(scope.area)();
        scope.edit_article.content = scope.area.part.content_wrap.innerHTML;
        Article.update(scope.edit_article, function(response){
          scope.logPanel = response.data;
          Article.load();
        });
        Editor.attachImageControls.bind(scope.area)();
      }

      /*
      Link Element for forms
      */
      scope.addLinkToForm = function(form){
        console.log(document.getSelection());
        let link = document.createElement('a');
        link.className = 'custom';
        link.href = "form/"+form.id;
        link.innerHTML = form.name;
        scope.area.insertAfterSelection(link);
      }


      scope.forms = [];
      Form.select_all(function(res){ scope.forms = res.data});
    }
  };
}]);
