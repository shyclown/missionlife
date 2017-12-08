app.directive('popFolderExplorer',['$http','Form','Shared', 'Folder', 'Article', 'Garant','FileService','uploadDropped',
function($http, Form, Shared, Folder, Article, Garant, FileService, uploadDropped) {
  return {
    restrict: 'E',
    scope:{ },
    templateUrl: '/_backend/app/template/explorer/pop_explorer.html',
    link: function (scope, element, attrs)
    {
      let Explorer = Shared.explorer;
      // reset it
      Shared.explorer.current_folder = 0;
      scope.currentFolder = 0;
      scope.folders = [];
      scope.articles = [];
      scope.files = [];
      scope.currentParents = [];
      scope.openFoldersInTree = [];

      // Article and File can be changed updated in outside directive

      scope.$watch(
        function(){ return Folder.allFolders; },
        function(){ scope.folders = Folder.allFolders; },
      true);
      // Load Folders
      let updateScope = function(){ scope.$apply(); }
      Folder.select_all(updateScope);

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

      let fil = {
      $$hashKey: "object:69",
      date_created: "2017-12-08 11:46:24",
      date_edited: "2017-12-08 11:46:24",
      file_name: "SLOVENIA-88.jpg",
      file_size: 1504470,
      file_src:"5a2a6d8059c07.png",
      file_type:"png",
      folder_id: 1,
      id: 86,
      item_id: 67,
      type: 4
    };
    new Shared.directiveElement('edit-file-window', fil, function(){
      //callback
    }, scope);

      // Create Windows
      scope.openFileWindow = function(file){
        new Shared.directiveElement('edit-file-window', file, function(){
          //callback
        }, scope);
      }
      scope.openFormWindow = function(form){
        new Shared.directiveElement('edit-form-window', form, function(){
          //callback
          Form.updateExplorer();
        }, scope);
      }
      scope.openFolderWindow = function(folder){
        new Shared.directiveElement('edit-folder-window', folder, function(){
          //callback
        }, scope);
      }
      scope.openGarantWindow = function(garant){
        new Shared.directiveElement('edit-garant-window', garant, function(image){
          //callback
          if(image){ FileService.updateExplorer(); };
          Garant.updateExplorer();
        }, scope);
      }
      scope.openArticleWindow = function(article){
        new Shared.directiveElement('edit-article-window', article, function(){
          //callback
          Article.updateExplorer();
        }, scope);
      }


      scope.prompted = function(message, description, cancelBtn, acceptBtn, callback){
        const promptObj = new Shared.prompt({
          message: message,
          description: description,
          cancelBtn: cancelBtn,
          acceptBtn: acceptBtn
        }, callback, scope);
      }

      /* File Upload On Drop */
      scope.uploadFile = function(){ FileService.uploadFile(scope.currentFolder); }

      scope.isOpenFolder = function(){ return scope.currentFolder != 0; }

      scope.openFolder = function(folder){
        // prompted action
        const inFolderArray = function(id){
          let pos = scope.openFoldersInTree.indexOf(id);
          return {
            open: pos >= 0, position: pos
          };
        }

        if(folder == 0){
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
