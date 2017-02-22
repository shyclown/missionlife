app.directive('popSelectFolder',['$http', 'Folder', function($http, Folder) {
  return {
    restrict: 'E',
    scope:{
    },
    templateUrl: '/missionlife/app/template/pop_select_folder.html',
    link: function (scope, element, attrs)
    {
      scope.currentFolder = null;
      scope.articleWindow = false;
      scope.openArticle = {
        new: true,
        header: 'No Article',
        content: 'No Article',
        state: 0 };
        console.log(scope.openArticle);
      scope.newArticle = {};

      const callbackFn = scope.$eval(attrs.callbackFn);
      const popSetup = {
        articles: false,
        article_click: false,
        files: false,
        file_click: false,
        submit: true
      }

      // Watch Folders
      scope.folders;
      scope.currentParents = [];
      scope.openFoldersInTree = [];

      scope.$watch(
        function(){ return Folder.allFolders; },
        function(){ scope.folders = Folder.allFolders;},
      true);
      // Load Folders
      Folder.select_all();
      // Load Articles in Folder


      const stopDefault = function(){
        event.stopPropagation();
        event.preventDefault();
      }
      const inFolderArray = function(id){
        let pos = scope.openFoldersInTree.indexOf(id);
        return {  open: pos >= 0, position: pos };
      }
      // ISSUE: After changes when article is created it jumps to parent Folder but saves Article to right folder

      // disable placing articles to null folder
      scope.isOpenFolder = function(){ return scope.currentFolder != null; }

      scope.openFolder = function(folder){
        if(folder == null){ scope.currentFolder = null; }
        else{
          const folderInArray = inFolderArray(folder.id);
          const folderIsCurrent = folder == scope.currentFolder;
          if(!folderIsCurrent){
            scope.currentFolder = folder;
            scope.currentParents = Folder.listParents(folder);
            loadFiles();
          }
          if(folderInArray.open && folderIsCurrent){
            scope.openFoldersInTree.splice(folderInArray.position, 1);
          }
          if(!folderInArray.open){
            scope.openFoldersInTree.push(folder.id);
          }
        }
      }

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

      scope.isOpen = function(folder){
        return folder.id == scope.currentFolder.id;
      }
      // New Folder Object
      scope.new_folder = {};
      scope.saveNewFolder = function(){
        let data = scope.new_folder;
        data.parent = scope.currentFolder;
        Folder.insert(data, function(response){
          scope.new_folder.name = "";
        });
      }
      scope.removeFolder = function(folder){ stopDefault(event);
        Folder.remove(folder);
      }
      scope.orderUp = function(folder){ stopDefault(event);
        Folder.orderUp(folder);
      }
      scope.orderDown = function(folder){ stopDefault(event);
        Folder.orderDown(folder);
      }
      scope.updateName = function(folder){ stopDefault(event);
        Folder.updateName(folder);
      }
      scope.updatePosition = function(folder){ stopDefault(event);
        Folder.updatePosition(folder);
      }
      // CSS Style
      scope.currentOpen = function(folder){
        return (folder.id == scope.openFolder.id) ? 'currentFolder' : '';
      }
    }
  };
}]);
