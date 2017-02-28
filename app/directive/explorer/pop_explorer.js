app.directive('popFolderExplorer',['$http','Form','Shared', 'Folder', 'Article', 'Garant','FileService','uploadDropped',
function($http, Form, Shared, Folder, Article, Garant, FileService, uploadDropped) {
  return {
    restrict: 'E',
    scope:{ },
    templateUrl: '/missionlife/app/template/pop_folder_window.html',
    link: function (scope, element, attrs)
    {
      let Explorer = Shared.explorer;

      scope.currentFolder = Shared.currentFolder;
      scope.folders = [];
      scope.articles = [];
      scope.files = [];
      scope.currentParents = [];
      scope.openFoldersInTree = [];

      // Article and File can be changed updated in outside directive

      scope.$watch( function(){ return Folder.allFolders; },
      function(){ scope.folders = Folder.allFolders;}, true);
      // Load Folders
      Folder.select_all();

      const explorer = Shared.explorer;
      scope.$watch( function(){ return explorer.articles; }, function(){ scope.articles = explorer.articles; }, true );
      scope.$watch( function(){ return explorer.garants; }, function(){ scope.garants = explorer.garants; }, true );
      scope.$watch( function(){ return explorer.files; }, function(){ scope.files = explorer.files; }, true );
      scope.$watch( function(){ return explorer.forms; }, function(){ scope.forms = explorer.forms; }, true );

      scope.$watch(
        function(){ return Shared.window; },
        function(){ scope.isOpenWindow = Shared.window; },
      true );


      const stopDefault = function(){ event.stopPropagation(); event.preventDefault(); }


      /* Folder Editor Window */
      scope.folderWindow = false;
      scope.editFolder = {};
      scope.toogleEditFolder = function(){ scope.folderWindow = !scope.folderWindow; }
      scope.setEditFolder = function(folder){
        stopDefault(event);
        scope.editFolder = folder;
        scope.toogleEditFolder();
      }
      scope.setPosition = function(position){
        scope.editFolder.position = position;
        scope.updatePosition(scope.editFolder);
      }

      scope.new_folder = {};
      scope.saveNewFolder = function(){
        let data = scope.new_folder;
        data.parent = scope.currentFolder;
        Folder.insert(data, function(response){
          scope.new_folder.name = "";
        });
      }

      /* Window */
      let windowID = 0;
      scope.openWindows = [];
      scope.openWindow = function(type, item, callback){
        const generatedID = type+'Window_'+windowID;
        const generatedOBJ = 'openWindows.'+generatedID;
        scope.openWindows[generatedID] = new Shared.editWindowElement(type, generatedOBJ, item, callback, scope);
        windowID++; //
        return scope.openWindows[generatedID];
      }


      /* File Window Data */
      /* Tool */
      const callbackFile = function(image){ }
      scope.openFileWindow = function(file){
        element.append(scope.openWindow('file', garant, callbackGarant).el);
      }
      /* Form Window Data */
      const callbackForm = function(image){ Form.updateExplorer(); }
      scope.openFormWindow = function(form){
        element.append(scope.openWindow('form', garant, callbackGarant).el);
      }
      /* Garant Window */
      const callbackGarant = function(image){
        if(image){ FileService.updateExplorer(); }
        Garant.updateExplorer();
      }
      scope.openGarantWindow = function(garant){
        element.append(scope.openWindow('garant', garant, callbackGarant).el);
      }

      /* Article Window Data */

      scope.openArticle = {
        new: true,
        header: 'No Article',
        content: 'No Article',
        state: 0 };
      scope.newArticle = {};

      callbackArticle = function(){};

      scope.selectArticle = function(article){
        element.append(scope.openWindow('article', article, callbackArticle).el);
      }
      scope.createNewArticle = function(){
        Article.insert({
          header: 'New Article',
          content: '<p>Content</p>',
          folder_id: scope.currentFolder.id,
          state: 0 },
          function( response ){
          Article.select_by_id({id: response.data},
            function(ArticleByID){
            const article = ArticleByID.data[0]; // data[0], because ajax returns array of results
            element.append(scope.openWindow('article', article, callbackArticle).el);
          });
        })
      }

      /* File Upload On Drop */

      scope.uploadFile = function(){
        const files = event.dataTransfer.files;
        const all = files.length;
        const oData = function(response){
          return { file_id: response.data.file_id, folder_id: scope.currentFolder.id }
        }
        const refreshFiles = function(update){
          return function(){ if(update){ FileService.updateExplorer();  } }
        }
        // refres only after all filea are uploaded
        let completed = 0;
        for (let i = 0; i < all; i++){ let file = [files[i]];
          uploadDropped(file, false, function(response){
            completed++;
            let update = completed == all;
            FileService.attachToFolder( oData(response), refreshFiles(update));});
        }
      }

      /* Folders */

      scope.isOpenFolder = function(){ return scope.currentFolder != null; }
      scope.openFolder = function(folder){
        const inFolderArray = function(id){
          let pos = scope.openFoldersInTree.indexOf(id);
          return {  open: pos >= 0, position: pos };
        }
        if(folder == null){
          scope.currentFolder = folder;
          Shared.explorer.current_folder = folder;
        }
        else{
          const folderInArray = inFolderArray(folder.id);
          const folderIsCurrent = folder == scope.currentFolder;
          if(!folderIsCurrent){
            Shared.explorer.current_folder = folder;
            scope.currentFolder = folder;
            scope.currentParents = Folder.listParents(folder);
          }
          if(folderInArray.open && folderIsCurrent){
            scope.openFoldersInTree.splice(folderInArray.position, 1);
          }
          if(!folderInArray.open){ scope.openFoldersInTree.push(folder.id); }

          // Load forms
        }
      }
      scope.isOpen = function(folder){ return folder.id == scope.currentFolder.id; }
      scope.removeFolder = function(folder){ stopDefault(event); Folder.remove(folder); }
      scope.orderUp = function(folder){ stopDefault(event); Folder.orderUp(folder); }
      scope.orderDown = function(folder){ stopDefault(event); Folder.orderDown(folder); }
      scope.updateName = function(folder){ stopDefault(event); Folder.updateName(folder); }
      scope.updatePosition = function(folder){ stopDefault(event); Folder.updatePosition(folder); }
      // CSS Style
      scope.currentOpen = function(folder){ return (folder.id == scope.openFolder.id) ? 'currentFolder' : ''; }
    }
  };
}]);
