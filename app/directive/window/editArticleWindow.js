/* Uses Editor */

app.directive('editArticleWindow',['$http','Folder', 'Article', 'Form', 'uploadDroppedToArticle', 'Shared',
function($http, Folder, Article, Form, uploadDroppedToArticle, Shared) {
  return {
    restrict: 'E',
    scope:{ articleWindow : '=editObj' },
    templateUrl: '/missionlife/app/template/window/edit_article_window.html',
    link: function (scope, element, attrs)
    {
      const targetUrl = '/missionlife/system/ng/call.php?class=file';
      const explorer = Shared.explorer;
      scope.logPanel = 'log panel';
      scope.elArticleHeader = document.getElementById('articleEditorHeader');
      scope.elArticleContent = document.getElementById('articleEditorContent');
      scope.elArticleContent.value = scope.content;

      scope.openArticle = scope.articleWindow.item;
      scope.files = {};

      scope.area = new Editor.area({
        input_id:'articleEditorContent',
        form_id:'articleEditorForm',
        image_url : '/missionlife/uploads/image/',
      });
      scope.loadFilesOfArticle = function(){
        if(scope.openArticle.id){
          Article.load_files( scope.edit_article, function(response){
            scope.files = response.data;
          });
        }
      }
      if(scope.openArticle){
        scope.edit_article = Object.assign({},scope.openArticle);
        scope.area.update_content(scope.edit_article.content);
        Editor.attachImageControls.bind(scope.area)();
        scope.loadFilesOfArticle();
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
      scope.isOpen = 'all';
      scope.filter_str;
      scope.open = function(item){ return scope.isOpen == item; }
      scope.show = function(item){ scope.isOpen = item; }
      scope.filter = function(){ console.log(scope.filter_str);  }
      scope.filterArray = function(arr, prop){
        if(arr){
          return arr.filter(function(item){
            return item[prop].match(scope.filter_str);
          });
        }
      }

      scope.closeWithoutSave = function(){
        scope.articleWindow.close();
        //Article.selectByFolder({ folder_id: scope.currentFolder.id });
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
      scope.deleteArticle = function(article){
        Article.delete(article, function(){
          Article.selectByFolder({ folder_id: explorer.current_folder.id });
        });
      }
      scope.saveChanges = function(){
        let sel = document.getSelection();
        Editor.removeImageControls.bind(scope.area)();
        scope.edit_article.content = scope.area.part.content_wrap.innerHTML;
        Article.update(scope.edit_article, function(response){
          scope.logPanel = response.data;
          Article.selectByFolder({ folder_id: explorer.current_folder.id });
        });
        Editor.attachImageControls.bind(scope.area)();
        }

  //-----------------------------------------------------
  // Select Window
  //-----------------------------------------------------

  /* Default */

  scope.popSelect = false;
  scope.cancelPopSelect = function(){ scope.popSelect = false;}
  scope.showPopSelect = function(){  scope.popSelect = true;}
  scope.selectFn = function(selected){ scope.addLinkToArticle(selected.obj); }

  /* Setup */

  const selectArticle = {
    imageSelect: false,
    articles : true,
    files: false,
    forms: false,
    selectFolder: false,
    selectArticleOrFile: true,
    createFolder: false
  }
  const selectFile = {
    imageSelect: false,
    articles : false,
    files: true,
    forms: false,
    selectFolder: false,
    selectArticleOrFile: true,
    createFolder: false
  }
  const selectForm = {
    imageSelect: false,
    articles : false,
    files: false,
    forms: true,
    selectFolder: false,
    selectArticleOrFile: true,
    createFolder: false
  }

  /* Range */

  let storedRange = {};
  function storeSelection(){
    oSelection = document.getSelection();
    storedRange = oSelection.getRangeAt(0);
  }
  function loadSelection() {
    let oSelection = document.getSelection();
    oSelection.removeAllRanges();
    oSelection.addRange(storedRange);
  }

  /* Add Links to Items */

  const addLink = function(selected){
    loadSelection();
    let link = document.createElement('a');
    link.className = 'custom';
    link.href = selected.path+"/"+selected.target;
    link.innerHTML = selected.name;
    scope.area.insertAfterSelection(link);
  }

  /* Event Function */

  const openPopSelect = function(setup, after){ return function(){
      storeSelection();
      scope.setupSelect = setup;
      scope.selectFn = function(selected){ after(selected); }
      scope.showPopSelect();
    }
  }

  scope.selectArticlePop = openPopSelect(selectArticle, addLink);
  scope.selectFilePop = openPopSelect(selectFile, addLink);
  scope.selectFormPop = openPopSelect(selectForm, addLink);

    }// link
  };
}]);
