/* Uses Editor */

app.directive('editArticleWindow',['$http', '$compile','Folder', 'Article', 'Form', 'uploadDropped', 'Shared',
function($http, $compile, Folder, Article, Form, uploadDropped, Shared) {
  return {
    restrict: 'E',
    scope:{},
    templateUrl: '/missionlife/app/template/window/edit_article_window.html',
    link: function (scope, element, attrs)
    {
      const oArticleWindow = Shared.openElement[attrs.editObj];
      const oArticle = oArticleWindow.item;
      const explorer = Shared.explorer;
      const newArticle = {
        header: 'New Article',
        content: '<p>Content</p>',
        folder_id: explorer.current_folder.id,
        state: 0
      }
      const targetUrl = '/missionlife/system/ng/call.php?class=file';
      const callbackFn = function(){
        oArticleWindow.callback();
        oArticleWindow.close();
      }

      /* SCOPE */

      scope.articleWindow = Shared.openElement[attrs.editObj];
      scope.logPanel = 'log panel';
      scope.elArticleHeader = document.getElementById('articleEditorHeader');
      scope.elArticleContent = document.getElementById('articleEditorContent');
      scope.elArticleContent.value = scope.content; // ??
      scope.files = {};

      /* EDITOR AREA SETUP */

      scope.area = new Editor.area({
        input_id:'articleEditorContent',
        form_id:'articleEditorForm',
        image_url : '/missionlife/uploads/image/',
      });

      /* LOAD FILES - not implemented */

      const loadFilesOfArticle = function(){
        if(oArticle){
          Article.load_files( oArticle, function(response){
            scope.files = response.data;
          });
        }
      }

      /* OPEN ARTICLE */

      if(!oArticle){
        scope.article = Object.assign({}, newArticle);
        Article.insert(newArticle, function(res){ scope.article.id = res.data; });
      }else{
        scope.article = Object.assign({}, oArticle);
      }
      scope.area.update_content(decodeURIComponent(scope.article.content));

      // compile links
      let content = scope.area.part.content_wrap;
      let links = content.getElementsByClassName('link');
      for (var i = 0; i < links.length; i++) {
        let link = links[i]
        link = $compile(link)(scope);
      }


      Editor.attachImageControls.bind(scope.area)();
      loadFilesOfArticle();

      // Article state
      scope.stateText = function(){
        if(scope.article && scope.article.state){ return 'dectivate'; }
        else{ return 'activate'; }
      }
      scope.changeState = function(){
        scope.article.state = !scope.article.scope;
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
        oArticleWindow.close();

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

          let res = uploadDropped.bind(null,
            file,
            function(response){},
            function(response){
              console.log(response.data);
              completed++;
              // TODO:  attach to article //
              // FileService.attachToArticle
              // loadFilesOfArticle();
              scope.logPanel = response;
              scope.onDropFiles(response);
              area.afterImageUpload(response);

              // if all processes are completed we remove placeholder
              if(completed == all){
                area.removePlaceholder();
              //  scope.saveChanges();
              }
            })();
        }
      }
      scope.deleteArticle = function(article){
        Article.delete(article, function(){
          callbackFn();
        });
      }
      scope.saveChanges = function(){
        let sel = document.getSelection();
        Editor.removeImageControls.bind(scope.area)();
        scope.article.content = encodeURIComponent(scope.area.part.content_wrap.innerHTML);
        Article.update(scope.article, function(response){
          callbackFn();
          console.log(response.data);
        });
        Editor.attachImageControls.bind(scope.area)();
        }

  //-----------------------------------------------------
  // Select Window
  //-----------------------------------------------------
      /* Range */
      let storedRange = {};
      let storedItem = {};
      /* Add Links to Items */
      const createLink = function(name, href){
        let link = document.createElement('a');
        link.setAttribute('ng-click', 'editWebLinkPop(true)');
        link.href = href;
        link.className = 'link';
        link.contentEditable = false;
        link.innerHTML = name;
        return link;
      }
      const addLink = function(data){
        if(data.target){data.href = data.path+"/"+data.target; data.new = true; }
        if(data.new){
          let link = $compile(createLink(data.name, data.href))(scope);
          let oSelection = Shared.fn.selectRange(Shared.storedRange);
          scope.area.insertAfterSelection(link[0]);
          newCaretPosition(oSelection, link[0].nextSibling, 0);
        }else{
          storedItem.innerHTML = data.name;
          storedItem.href = data.href;
        }
      }
      /* Event Function */
      const openPopSelect = function(setup, callback){
        return function(){
          Shared.storedRange = Shared.fn.storeRange();
          new Shared.directiveElement('pop-select', Shared.setupSelect[setup], callback, scope);
        }
      }

      scope.selectArticlePop = openPopSelect('selectArticle', addLink);
      scope.selectFilePop = openPopSelect('selectFile', addLink);
      scope.selectFormPop = openPopSelect('selectForm', addLink);
      scope.selectFolderPop = openPopSelect('selectFolder', addLink);
      scope.selectImagePop = openPopSelect('selectImage', addLink);

      let myScope = scope;

      scope.editWebLinkPop = function(item){
        event.preventDefault();
          if(item){ storedItem = event.target; item = { name: event.target.innerHTML, href: event.target.href, el: event.target };}
          else{ Shared.storedRange = Shared.fn.storeRange(); }
          new Shared.directiveElement('pop-edit-web-link', item, addLink, scope);
      }

    }// link
  };
}]);
