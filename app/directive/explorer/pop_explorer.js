app.directive('popFolderExplorer',['$http','Form','Shared', 'Folder', 'Article', 'Garant','FileService','uploadDropped',
function($http, Form, Shared, Folder, Article, Garant, FileService, uploadDropped) {
  return {
    restrict: 'E',
    scope:{ },
    templateUrl: '/missionlife/app/template/explorer/pop_explorer.html',
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

      scope.new_folder = {};
      scope.saveNewFolder = function(){
        let data = scope.new_folder;
        data.parent = scope.currentFolder;
        Folder.insert( data, function(response){ scope.new_folder.name = ""; });
      }
      /* Window */
      scope.openWindows = [];
      const openWindow = function(name, item, callback){
        name = 'edit-'+name+'-window';
        return  new Shared.directiveElement(name, item, callback, scope);
      }
      const callbackArticle = function(){}
      const callbackFile = function(){}
      const callbackFolder = function(){}
      const callbackForm = function(){ Form.updateExplorer(); }
      const callbackGarant = function(image){ if(image){ FileService.updateExplorer(); }; Garant.updateExplorer(); }

      scope.openFileWindow = function(file){ element.append(openWindow('file', file, callbackGarant).el); }
      scope.openFormWindow = function(form){ element.append(openWindow('form', form, callbackGarant).el); }
      scope.openFolderWindow = function(folder){ element.append(openWindow('folder', folder, callbackFolder).el); }
      scope.openGarantWindow = function(garant){ element.append(openWindow('garant', garant, callbackGarant).el); }
      scope.openArticleWindow = function(article){ element.append(openWindow('article', article, callbackArticle).el); }

      scope.prompted = function(message, description, cancelBtn, acceptBtn, callback){
        const promptObj = new Shared.prompt({
          message: message,
          description: description,
          cancelBtn: cancelBtn,
          acceptBtn: acceptBtn
        }, callback, scope);
      }

      scope.createNewArticle = function(){
        const newArticle = { header: 'New Article', content: '<p>Content</p>', folder_id: scope.currentFolder.id, state: 0 }
        Article.insert(newArticle, function( response ){
          Article.select_by_id({id: response.data}, function(res){
            element.append(openWindow('article', res.data[0], callbackArticle).el);
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
        let completed = 0;
        for (let i = 0; i < all; i++){ let file = [files[i]];
          uploadDropped(file, false, function(response){
            completed++; // some files take longer to load
            let update = completed == all;
            FileService.attachToFolder( oData(response), refreshFiles(update));});
        }
      }

      scope.isOpenFolder = function(){ return scope.currentFolder != null; }
      scope.openFolder = function(folder){
        // prompted action
        scope.prompted(
          'Opening Folder',
          'by submiting to this you are going to open folder',
          'cancel',
          'Open Folder',
          function(){
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
              if(!folderInArray.open){
                scope.openFoldersInTree.push(folder.id);
              }
            }
          }
        );
      }
      scope.isOpen = function(folder){ return folder.id == scope.currentFolder.id; }

      // CSS Style

      scope.currentOpen = function(folder){ return (folder.id == scope.openFolder.id) ? 'currentFolder' : ''; }
      scope.fileTypeClass = function(type){
        let str = '';
        switch (type) {
          case 'pdf' :
            str = 'fa fa-file-pdf-o';
            break;
          case 'doc' :
            str = 'fa fa-file-word-o';
            break;
          case 'png' :
            str = 'fa fa-file-image-o';
            break;
          case 'txt' :
            str = 'fa fa-file-text-o';
            break;
          default:
            str = 'fa fa-file-o'
        }
        return str;
      }
    }
  };
}]);
