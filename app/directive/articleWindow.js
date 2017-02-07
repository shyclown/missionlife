/* Uses Editor */

app.directive('articleWindow',['$http','Folder', 'Article', 'Form', 'uploadDroppedToArticle', function($http, Folder, Article, Form, uploadDroppedToArticle) {
  return {
    restrict: 'E',
    scope:{ currentFolder: '=', openArticle: '=', articleWindow :'=' },
    templateUrl: '/missionlife/app/template/article_window.html',
    link: function (scope, element, attrs)
    {
      // url to place which handles file upload to article
      const targetUrl = '/missionlife/system/ng/files.php';
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

      // change filter
      scope.isOpen;
      scope.open = function(item){ return scope.isOpen == item; }
      scope.show = function(item){ scope.isOpen = item; }
      scope.filter = function(){
        console.log(scope.filter_str);
      }

      scope.closeWithoutSave = function(){
        scope.articleWindow = false;
      }
      // 2. Attaching callback function executed after drop of file or image
      scope.onDropFiles = function(response){ }

      scope.area.drop_file_callback = function(editorCallback){
        const files = event.dataTransfer.files;
        // Wait for all uploads to be completed and then remove placeholder
        let completed = 0;
        let all = files.length;

        for (let i = 0; i < all; i++){

          let file = [files[i]];
          let area = scope.area;

          let res = uploadDroppedToArticle.bind(null,
            file,
            function(response){},
            function(response){
              completed++;
              scope.logPanel = response;
              scope.onDropFiles(response);
              area.afterImageUpload(response);
              scope.loadFilesOfArticle();
              // if all processes are completed we remove placeholder
              if(completed == all){
                area.removePlaceholder();
                scope.saveChanges();
              }
            },
            scope.edit_article.id )();
        }
      }
      scope.saveChanges = function(){
        let sel = document.getSelection();
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
      scope.addLinkToArticle = function(article){
        console.log(document.getSelection());
        let link = document.createElement('a');
        link.className = 'custom';
        link.href = "article/"+article.id;
        link.innerHTML = article.header;
        scope.area.insertAfterSelection(link);
      }

      /* Articles to be added */
      scope.articlesList = [];
      scope.searchArticle = '';
      scope.loadArticleList = function(){
        Article.select_all(function(res){
          scope.articlesList = res.data;
          console.log(scope.articlesList); 
        });
      }
      scope.searchArticle = function(){
        if(scope.searchArticle == ''){ scope.loadArticleList(); }
        else{ Article.search({ search: scope.searchArticle }, function(res){ scope.articlesList})}
      }

      scope.forms = [];
      Form.select_all(function(res){ scope.forms = res.data});
      scope.loadArticleList();
    }
  };
}]);
